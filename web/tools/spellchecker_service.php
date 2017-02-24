<?php
$txtToCheck = $_REQUEST['txt'];
$fieldId = $_REQUEST['fieldId'];

$spellChecker = Loader::helper('spellchecker');
$correctedHTML = addslashes($spellChecker->findMisspellings($txtToCheck));
$suggestionPairs = $spellChecker->wordSuggestions;

header('content-type: application/json');
echo json_encode([
    'html' => '<div class="correctedHTML">' . 
        $correctedHTML .
        '</div><div id="suggestPopup">' .
        t('SuggestPopup') .
        '</div>',
    'suggestions' => $suggestionPairs,
    'fieldId' => $fieldId,
]);
