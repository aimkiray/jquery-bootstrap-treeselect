# jquery-bootstrap-treeselect

A tree jQuery plugin with search and selection capabilities, based on the open source software, which is useful to select data.

## Features

### no search
![no search](http://ozevind8t.bkt.clouddn.com/temp/image/select_tree.png)

### searched
![search](http://ozevind8t.bkt.clouddn.com/temp/image/search_select_tree.png)

- button mode
  - Click the button to display the drop-down menu.
  - The selected data is displayed on the button.
- search mode
  - Click the fake input box to display the drop-down menu.
  - Enter keywords to automatically filter the selection tree.
  - If the keyword matches only the subtree, all its parent trees are also displayed.
  - The selected data is displayed in the fake input box.
- both
  - Collapse all default data, click the left arrow to expand the next level.
  - Load data asynchronously via ajax.
  - Click the blank area to hide the drop-down menu.

## Basic Usage

```htmlmixed=
<head>
    <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
    <link href="css/jquery.bootstrap.treeselect.css" rel="stylesheet">
    <script src="js/jquery.bootstrap.treeselect.js"></script>
</head>

<body>
    <select multiple="multiple" id="productGroup"></select>
</body>

<script>
    $('#productGroup').treeselect({
                searchable: true,
                source: [{"value":"1","text":"Computers","checked":false,"children":[{"value":"2","text":"Processors","checked":false,"children":[]}]},{"value":"5","text":"Phone","checked":false,"children":[{"value":"6","text":"Nokia","checked":false,"children":[]}]}]
            });
</script>
```

## Props

### searchable

Type: `boolen`

Whether to open the search mode, if true, then use input instead of select, the user can enter the keyword filtering select tree.

### source

Type: `JSON`

Select tree data source, JSON array format. The subtree is contained in the field children, the select field controls whether the default selection.

### button

Type: `html`

Pull-down button style, the default bootstrap(Need to import).

### inputbutton

Type: `html`

Input box style, you can use bootstrap.

## Reference

This plug-in is based on [jquery-bootstrap-treeselect](https://github.com/semy/jquery-bootstrap-treeselect) secondary development.
