<?php
declare(strict_types=1);

session_name('portfolio_admin_session');
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$dataDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
$contentFile = $dataDirectory . DIRECTORY_SEPARATOR . 'portfolio.json';
$credentialsFile = $dataDirectory . DIRECTORY_SEPARATOR . 'credentials.json';
$requiredPortfolioKeys = ['hero', 'about', 'experience', 'projects', 'skills', 'education', 'certifications', 'contact'];

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function ensureDataDirectory(string $directory): void
{
    if (!is_dir($directory) && !mkdir($directory, 0777, true) && !is_dir($directory)) {
        respond(500, ['message' => 'Unable to create the portfolio data directory.']);
    }
}

function readJsonFile(string $filePath, array $fallback): array
{
    if (!is_file($filePath)) {
        return $fallback;
    }

    $rawContents = file_get_contents($filePath);

    if ($rawContents === false) {
        return $fallback;
    }

    $decodedValue = json_decode($rawContents, true);

    return is_array($decodedValue) ? $decodedValue : $fallback;
}

function writeJsonFile(string $filePath, array $payload): void
{
    $encodedPayload = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    if ($encodedPayload === false || file_put_contents($filePath, $encodedPayload, LOCK_EX) === false) {
        respond(500, ['message' => 'Unable to write the portfolio data file.']);
    }
}

function readRequestBody(): array
{
    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        return [];
    }

    $decodedPayload = json_decode($rawInput, true);

    if (!is_array($decodedPayload)) {
        respond(400, ['message' => 'Invalid JSON payload.']);
    }

    return $decodedPayload;
}

function isValidPortfolioContent(array $content, array $requiredKeys): bool
{
    foreach ($requiredKeys as $key) {
        if (!array_key_exists($key, $content)) {
            return false;
        }
    }

    return true;
}

function getCredentials(string $credentialsFile): array
{
    $defaultCredentials = [
        'username' => 'frank',
        'password' => 'Ombogo1234.',
    ];

    $credentials = readJsonFile($credentialsFile, $defaultCredentials);

    if (
        !isset($credentials['username'], $credentials['password']) ||
        !is_string($credentials['username']) ||
        !is_string($credentials['password']) ||
        trim($credentials['username']) === '' ||
        trim($credentials['password']) === ''
    ) {
        return $defaultCredentials;
    }

    return [
        'username' => trim($credentials['username']),
        'password' => $credentials['password'],
    ];
}

function getPortfolioContent(string $contentFile, array $requiredKeys): array
{
    $content = readJsonFile($contentFile, []);

    if (!isValidPortfolioContent($content, $requiredKeys)) {
        respond(500, ['message' => 'The system portfolio data is missing or invalid.']);
    }

    return $content;
}

function requireAuthentication(): void
{
    if (empty($_SESSION['portfolio_admin_authenticated'])) {
        respond(401, ['message' => 'You need to sign in to perform this action.']);
    }
}

ensureDataDirectory($dataDirectory);

$action = isset($_GET['action']) && is_string($_GET['action']) ? $_GET['action'] : 'public';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$credentials = getCredentials($credentialsFile);

if ($action === 'public' && $method === 'GET') {
    respond(200, [
        'data' => [
            'content' => getPortfolioContent($contentFile, $requiredPortfolioKeys),
            'username' => $credentials['username'],
        ],
    ]);
}

if ($action === 'session' && $method === 'GET') {
    respond(200, [
        'data' => [
            'authenticated' => !empty($_SESSION['portfolio_admin_authenticated']),
            'username' => $credentials['username'],
        ],
    ]);
}

if ($action === 'login' && $method === 'POST') {
    $payload = readRequestBody();
    $username = isset($payload['username']) && is_string($payload['username']) ? trim($payload['username']) : '';
    $password = isset($payload['password']) && is_string($payload['password']) ? $payload['password'] : '';

    if ($username !== $credentials['username'] || $password !== $credentials['password']) {
        respond(401, ['message' => 'Invalid username or password.']);
    }

    $_SESSION['portfolio_admin_authenticated'] = true;

    respond(200, [
        'data' => [
            'authenticated' => true,
            'username' => $credentials['username'],
        ],
    ]);
}

if ($action === 'logout' && $method === 'POST') {
    $_SESSION = [];
    session_destroy();

    respond(200, [
        'data' => [
            'authenticated' => false,
            'username' => $credentials['username'],
        ],
    ]);
}

if ($action === 'save-content' && $method === 'POST') {
    requireAuthentication();

    $payload = readRequestBody();
    $content = isset($payload['content']) && is_array($payload['content']) ? $payload['content'] : [];

    if (!isValidPortfolioContent($content, $requiredPortfolioKeys)) {
        respond(400, ['message' => 'The submitted portfolio data is incomplete.']);
    }

    writeJsonFile($contentFile, $content);

    respond(200, [
        'data' => [
            'content' => $content,
            'username' => $credentials['username'],
        ],
    ]);
}

if ($action === 'update-credentials' && $method === 'POST') {
    requireAuthentication();

    $payload = readRequestBody();
    $username = isset($payload['username']) && is_string($payload['username']) ? trim($payload['username']) : '';
    $password = isset($payload['password']) && is_string($payload['password']) ? $payload['password'] : '';

    if ($username === '' || trim($password) === '') {
        respond(400, ['message' => 'Both username and password are required.']);
    }

    $updatedCredentials = [
        'username' => $username,
        'password' => $password,
    ];

    writeJsonFile($credentialsFile, $updatedCredentials);
    $_SESSION['portfolio_admin_authenticated'] = true;

    respond(200, [
        'data' => [
            'username' => $updatedCredentials['username'],
        ],
    ]);
}

respond(405, ['message' => 'Unsupported API action or HTTP method.']);
