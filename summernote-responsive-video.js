/**
 *
 * copyright 2020 Annah Mwangi.
 * email:
 * license:MIT.
 *
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        // TODO: Add more languages!
        'en-US': {
            /* US English(Default Language) */
            responsiveVideo: {
                videoLabel: 'Video URL <small>(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)</small>',
                dialogSaveBtnMessage: 'Insert Video',
                dialogTitle: 'Insert Video',
            }
        }
    });

    // Extends plugins for video plugin.
    $.extend($.summernote.plugins, {
        'responsiveVideo': function (context) {
            var self = this;
            var options = context.options;
            // ui has renders to build ui elements
            var ui = $.summernote.ui,
                // options holds the Options Information from Summernote and what we extended above.
                options = context.options,
                // contentEditable element
                $editable = context.layoutInfo.editable,
                $editor = context.layoutInfo.editor,
                //lang holds the Language Information from Summernote and what we extended above.
                lang = options.langInfo,
                $note = context.layoutInfo.note;
            //create the video button
            context.memo('button.responsiveVideo', function () {
                return ui.buttonGroup({
                    className: 'note-ext-responsiveVideo',
                    children: [
                        ui.button({
                            contents: '<i class="note-icon-video"/>',
                            tooltip: 'video',
                            click: function () {
                                context.invoke('responsiveVideo.show');
                            }
                        }),
                    ]
                }).render();
            });

            this.initialize = function () {
                // get the correct container for the plugin how it's attached to the document DOM.
                var $container = options.dialogsInBody ? $(document.body) : $editor;
                var body = '<div class="form-group">' +
                    `<label for="note-dialog-video-url" class="note-form-label">${lang.responsiveVideo.videoLabel}</label>` +
                    '<input   class="note-video-url form-control note-form-control note-input" type="text" />' +
                    '</div>';

                // Build the Footer HTML of the Dialog.
                var footer = `<button href="#" class="btn btn-primary note-btn note-btn-primary note-video-btn">${lang.responsiveVideo.dialogSaveBtnMessage}</button>`;

                this.$dialog = ui.dialog({
                    title: lang.responsiveVideo.dialogTitle,
                    body: body,
                    footer: footer
                }).render().appendTo($container); //add the modal to the dom.

            };

            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };

            this.bindEnterKey = function ($input, $btn) {
                $input.on('keypress', function (event) {
                    if (event.keyCode === 13) {
                        $btn.trigger('click');
                    }
                });
            };

            this.bindLabels = function () {
                self.$dialog.find('.form-control:first').focus().select();
                self.$dialog.find('label').on('click', function () {
                    $(this).parent().find('.form-control:first').focus();
                });
            };

            this.createResponsiveVideoFrame = function (videoUrl) {
                //create the responsive div.
                var div = document.createElement('div');
                div.setAttribute('class', 'note-editable hk-video');
                div.style.cssText = 'padding:10% 0 0 0; position:relative;';
                //create responsive iframe.
                var iframe = document.createElement('iframe');
                iframe.src = videoUrl.trim();
                iframe.setAttribute('frameborder', 0);
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('allowfullscreen', true);
                iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
                div.appendChild(iframe);
                context.invoke('editor.insertNode', div);
                context.invoke('editor.afterCommand');
            };

            this.show = function (data) {
                context.invoke('editor.saveRange');
                this.showResponsiveDialog().then(function (data) {
                    // [workaround] hide dialog before restore range for IE range focus
                    ui.hideDialog(self.$dialog);
                    context.invoke('editor.restoreRange');
                    if (data.trim().length > 0) {
                        self.createResponsiveVideoFrame(data);
                    }
                }).fail(function () {
                    context.invoke('editor.restoreRange');

                });
            };

            this.showResponsiveDialog = function () {
                return $.Deferred(function (deferred) {
                    var $editBtn = self.$dialog.find('.note-video-btn');
                    var $videoUrl = self.$dialog.find('.note-video-url');
                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                        $editBtn.click(function (e) {
                            e.preventDefault();
                            deferred.resolve($videoUrl.val());
                        });

                        $videoUrl.on('keyup paste', function () {
                            var url = $videoUrl.val();
                            ui.toggleBtn($editBtn, url);
                        }).val('');


                        self.bindEnterKey($editBtn);
                        self.bindLabels();
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off('click');
                        $videoUrl.off('keyup paste keypress');
                        if (deferred.state() === 'pending') deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                });
            };
        }
    });
}));
