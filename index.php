<?php
$TOKEN = "8594017134:AAErZWjCCpVECDe1GjM427M4f_ZMkdTMxWM";
$CHAT_ID = "1252968307";

$msg = $_GET["msg"] ?? "empty";

$url = "https://api.telegram.org/bot{$TOKEN}/sendMessage";

$params = [
    "chat_id" => $CHAT_ID,
    "text" => $msg,
    "parse_mode" => "HTML"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

echo "<pre>";
echo "Response:\n";
var_dump($response);
echo "\nCurl error:\n";
var_dump($error);
echo "</pre>";
