<script language="javascript" type="text/javascript">
tinyMCE.init(<?= json_encode(Loader::helper('tinymce')->getOptions([
    'width' => '100%',
    'content_css' => (isset($theme) && is_object($theme)) ? $theme->getThemeEditorCss() : null,
])) ?>);
</script>
