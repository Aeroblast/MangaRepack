const locale_all = {
    nav_settings: [
        "设置",
        "Settings",
        "設定"
    ],
    nav_content: [
        "编辑内容",
        "Edit content",
        "編集"
    ],
    nav_metadata: [
        "编辑元数据",
        "Edit metadata"
    ],
    nav_preview: [
        "预览并保存",
        "Preview & Save"
    ],
    nav_about: [
        "关于",
        "About",
        "このアプリについて"
    ],
    menu_file: [
        "文件",
        "File",
        "フィール"
    ],
    menu_import: [
        "导入",
        "Import"
    ],
    menu_save: [
        "保存",
        "Save"
    ],
    settings_zip_encoding: [
        "压缩文件编码",
        "Filename encoding of zip files"
    ],
    settings_default: [
        "默认",
        "Default"
    ],
    settings_sort: [
        "排序方法",
        "Sort Method"
    ],
    settings_SortByFullPath: [
        "使用整个路径",
        "Use full path"
    ],
    settings_SortByFileName: [
        "只使用文件名",
        "Use filename only"
    ],
    editor_add_placeholder: [
        "在此增加空白页",
        "Add placeholder"
    ],
    editor_edit_this_page: [
        "编辑此页",
        "Edit this page"
    ],
    editor_delete_page: [
        "删除此页",
        "Delete this page"
    ],
    editor_guide: [
        "导航",
        "Guide"
    ],
    editor_toc_entry: [
        "目录入口",
        "Content"
    ],
    metadata_language: [
        "语言",
        "Language"
    ],
    metadata_title: [
        "标题",
        "Title"
    ],
    metadata_date: [
        "出版日期",
        "Date of publication"
    ],
    metadata_creator: [
        "作者",
        "Creator"
    ],
    metadata_file_as: [
        "排序名称",
        "File-as"
    ],
    metadata_file_as_tip: [
        "比如该项目的全片假名写法。可不填。",
        "A computer-friendly name, like romaji or katagana. Could leave empty."
    ],
    metadata_source: [
        "来源",
        "Source"
    ],
    metadata_publisher: [
        "出版者",
        "Publisher"
    ],
    metadata_delete: [
        "删除此项",
        "Delete"
    ],
    metadata_meta: [
        "通用项目",
        "General meta record"
    ],
    metadata_meta_property: [
        "名称",
        "Name of property"
    ],
    metadata_meta_value: [
        "值",
        "Value"
    ],
    metadata_onlyone: [
        "请注意该项目只能添加一个",
        "Please note only one permitted"
    ],
    metadata_add_optional: [
        "添加可选项",
        "Add optional records"
    ],
    msg_importing: [
        "导入中……",
        "Reading imported file..."
    ],
    msg_imported: [
        "导入完成！",
        "All file Imported"
    ],
    about_content: [
        "将漫画打包为EPUB格式。可以导入Apple Books等软件自己看。也可以用于kindle direct publish（大概）。",
        "Pack up images to EPUB. Compatible with Apple Books (just open with it), or kindle direct publish (not sure. It should work)."
    ]
}
function GenarateLocale(i) {
    let l = new Object();
    for (const key in locale_all)
        l[key] = locale_all[key][i];
    return l;
}
const locale_zhCN = GenarateLocale(0);
const locale_en = GenarateLocale(1);
function GetUserLocale() {
    switch (window.navigator.language) {
        case "zh-CN":
            return locale_zhCN;
        default:
            return locale_en;
    }
}