<?php if (ENABLE_REGISTRATION_CAPTCHA) { ?>
    <script src='https://www.google.com/recaptcha/api.js'></script>
<?php } ?>
<script>
function concrete_handleSubmitRegistration() {
    document.querySelector('.concrete-registration-form').submit();
}
</script>

<div class="row">
    <div class="span10 offset1">
        <div class="page-header">
            <h1><?= t('Site Registration') ?></h1>
        </div>
    </div>
</div>
<div class="ccm-form">
    <?php
    $attribs = UserAttributeKey::getRegistrationList();

    if ($success) { ?>
    <div class="row">
        <div class="span10 offset1">
            <?php switch ($success) {
            case "registered":
            ?>
            <p><strong><?= $successMsg ?></strong></p>
            <?php
            break;
            case "validate":
            ?>
            <p><?= $successMsg[0] ?></p>
            <p><?= $successMsg[1] ?></p>
            <?php
            break;
            case "pending":
            ?>
            <p><?= $successMsg ?></p>
            <?php
            break;
            } ?>
            <p><a href="<?= $this->url('/')?>"><?= t('Return to Home')?></a></p>
        </div>
    </div>
    <?php
    } else { ?>

    <form
        method="post"
        action="<?= $this->url('/register', 'do_register')?>"
        class="form-horizontal concrete-registration-form"
    >
        <div class="row">
            <div class="<?= count($attribs) ? 'span5' : 'span10' ?> offset1">
                <fieldset>
                    <legend><?= t('Your Details')?></legend>
                    <?php if ($displayUserName) { ?>
                    <div class="control-group">
                        <?= $form->label('uName', t('Username')); ?>
                        <div class="controls">
                            <?= $form->text('uName'); ?>
                        </div>
                    </div>
                    <?php } ?>

                    <div class="control-group">
                        <?= $form->label('uEmail', t('Email Address')); ?>
                        <div class="controls">
                            <?= $form->text('uEmail'); ?>
                        </div>
                    </div>
                    <div class="control-group">
                        <?= $form->label('uPassword', t('Password')); ?>
                        <div class="controls">
                            <?= $form->password('uPassword'); ?>
                        </div>
                    </div>
                    <div class="control-group">
                        <?= $form->label('uPasswordConfirm', t('Confirm Password')); ?>
                        <div class="controls">
                            <?= $form->password('uPasswordConfirm'); ?>
                        </div>
                    </div>

                </fieldset>
            </div>
            <?php if (count($attribs) > 0) { ?>
            <div class="span5">
                <fieldset>
                    <legend><?= t('Options')?></legend>
<?php
                    $af = Loader::helper('form/attribute');

                    foreach ($attribs as $ak) {
                        $af->display($ak, $ak->isAttributeKeyRequiredOnRegister());
                    }
?>
                </fieldset>
            </div>
            <?php } ?>
            <div class="span10 offset1 ">
                <?php if (ENABLE_REGISTRATION_CAPTCHA) { ?>

                <div class="control-group">
                    <?php $captcha = Loader::helper('validation/captcha'); ?>
                    <?= $captcha->label()?>
                    <div class="controls">
                        <?php
                        $captcha->showInput();
                        $captcha->display();
                        ?>
                    </div>
                </div>
                <?php } ?>

            </div>
            <div class="span10 offset1">
                <div class="actions">
                    <?= $form->hidden('rcID', $rcID); ?>
                    <button
                        class="g-recaptcha"
                        data-sitekey="<?= GOOGLE_RECAPTCHA_KEY ?>"
                        data-callback="concrete_handleSubmitRegistration"
                    >
                        Submit
                    </button>
                </div>
            </div>

        </div>
    </form>
    <?php } ?>
</div>
