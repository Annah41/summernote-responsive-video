# summernote-responsive-video

A plugin for the Summernote WYSIWYG editor 

Adds a responsive video to the summernote WYSIWYG editor.

<h3>Include JS</h3>
```<script src="summernote-responsive-video.js"></script>```

<h3>Summernote options</h3>
```
(document).ready(function() {
    $('#summernote').summernote({
        height: 200,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            toolbar: [
               ['insert', ['responsiveVideo']],
               ['misc', ['undo', 'redo', 'codeview', 'fullscreen']]
            ]
            
    });
});
```
