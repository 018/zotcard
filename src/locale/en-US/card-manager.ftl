zotcard-card-manager = Card Manager

zotcard-card-manager-toolbar-menu-title =
    .title = Menu
zotcard-card-manager-toolbar-refresh-title =
    .title = Refresh
zotcard-card-manager-toolbar-edit-title =
    .title = Edit
zotcard-card-manager-toolbar-replace-title =
    .title = Replace
zotcard-card-manager-toolbar-remove-title =
    .title = Remove
zotcard-card-manager-toolbar-delete-title =
    .title = Delete
zotcard-card-manager-toolbar-copy-title =
    .title = Copy
zotcard-card-manager-toolbar-print-title =
    .title = Print
zotcard-card-manager-toolbar-selectedall-title =
    .title = Select All
zotcard-card-manager-toolbar-unselectedall-title =
    .title = Unselected All
zotcard-card-manager-toolbar-view-title =
    .title = View
zotcard-card-manager-toolbar-hide-title =
    .title = Hide
zotcard-card-manager-toolbar-collapse-title =
    .title = Collapse
zotcard-card-manager-toolbar-expand-title =
    .title = Expand
zotcard-card-manager-toolbar-zotero-title =
    .title = Positioning at Zotero
zotcard-card-manager-toolbar-window-title =
    .title = A separate new window opens
zotcard-card-manager-toolbar-showorhide-title = 
    .title = Show/do not show
zotcard-card-manager-toolbar-selectedorunselected-title = 
    .title = Select/do not select
zotcard-card-manager-toolbar-cardviewer-title = 
    .title = Card Viewer



zotcard-card-manager-toolbar-all = All
zotcard-card-manager-toolbar-onlyshow = Only show
zotcard-card-manager-toolbar-onlyhide = Only hide
zotcard-card-manager-toolbar-onlyexpand = Only expand
zotcard-card-manager-toolbar-onlycollapse= Only collapse
zotcard-card-manager-toolbar-onlyselected = Only selected

zotcard-card-manager-toolbar-report = Card Report
zotcard-card-manager-toolbar-copy-content = Copy content
zotcard-card-manager-toolbar-copy-text = Copy text
zotcard-card-manager-toolbar-copy-markdown = Copy Markdown
zotcard-card-manager-toolbar-copy-html = Copy html
zotcard-card-manager-toolbar-copy-link = Copy link

zotcard-card-manager-date = Date
zotcard-card-manager-dateAdded = DateAdded
zotcard-card-manager-dateModified = DateModified
zotcard-card-manager-title = Title
zotcard-card-manager-content = Content
zotcard-card-manager-words = Words
zotcard-card-manager-lines = Lines
zotcard-card-manager-sizes = Sizes

zotcard-card-manager-collections = Collections
zotcard-card-manager-relations = Relations
zotcard-card-manager-cardtype = Card Type
zotcard-card-manager-tags = Tags

zotcard-card-manager-nomore = total cards: {$total}, filter cards: {$filter}
zotcard-card-manager-loading = Load in card ...

zotcard-card-manager-nodata = Please first select a library here:
zotcard-card-manager-nofilterdata = total number of cards: {$total}, no data for filtering.

zotcard-card-manager-filter = Filter
zotcard-card-manager-filter-library = Library
zotcard-card-manager-filter-match = Matching condition
zotcard-card-manager-filter-match_all = All
zotcard-card-manager-filter-match_any = Any
zotcard-card-manager-filter-total = Total:
zotcard-card-manager-filter-current = Number of filtered cards:
zotcard-card-manager-filter-saveas = The above conditions are saved as
zotcard-card-manager-filter-saves = Saved condition
zotcard-card-manager-filter-saves-load = Load
zotcard-card-manager-filter-saves-delete = Delete
zotcard-card-manager-filter-saves-confirm_delete = Are you sure to delete it?
zotcard-card-manager-filter-saves-time = Save in
zotcard-card-manager-filter-save-exist = {$title} already exists
zotcard-card-manager-filter-save-notexist = {$title} does not exist
zotcard-card-manager-ui = UI
zotcard-card-manager-ui-title_fontsize = Title font
zotcard-card-manager-ui-centent_fontsize = Content font
zotcard-card-manager-ui-columns = Row number
zotcard-card-manager-ui-height = Card height
zotcard-card-manager-setting = Setting
zotcard-card-manager-setting-message = The following configuration is valid globally and also for card reports.
zotcard-card-manager-setting-parse = Analyze
zotcard-card-manager-setting-parse_date = Date
zotcard-card-manager-setting-parse_date_message = After opening, the contents of the card will be parsed including "日期: "Or" date: "(case insensitive letters) and the date format is 2024-01-01 or 2024/01/01 or 2024.01.01 or 20240101 as the card date, and the date when the card was created is the card date in the absence of this content or when closed.
zotcard-card-manager-setting-parse_tags = Tags
zotcard-card-manager-setting-parse_tags_message = When enabled, the contents of the card will be parsed including "标签:", "tags:" or "tag:" (the letters are case insensitive) and the following three label formats are supported: 1, [tag 1] [tag 2] [tag 2]; <br>2, # Tag 1# # Tag 2# # Tag 3#; <br>3, Label 1, Label 2, label 3. Zotero labels are not affected when <br> is closed.
zotcard-card-manager-setting-parse_cardtype = Card Type
zotcard-card-manager-setting-parse_cardtype_message = After opening, the card title including "卡" or "card" will be analyzed, and the Chinese character in front of "card" or the alphanumeric in front of "card" (letter is not case sensitive) will be taken as the card type.
zotcard-card-manager-setting-parse_words = Words
zotcard-card-manager-setting-parse_words_message = When opened, the word count of the card will be parsed.
zotcard-card-manager-setting-exclude = Exclude略
zotcard-card-manager-setting-exclude_title = Title
zotcard-card-manager-setting-exclude_title_message = After setting, the cards that ignore the title are separated by newlines, and fuzzy matching is supported: <br>* represents 0 or n; <br>+ indicates at least 1; <br>?  Indicates a maximum of 1. <br> For example: 1, ignore the card title "catalog" : catalog; <br>2. Ignore the card whose title begins with the golden sentence card: Golden sentence card *; . <br>3. Ignore cards whose title ends with "Ignore" : * [ignore]; . <br>4. Ignore cards whose titles include reading records: * Reading records *. <br> Too much neglect may affect the loading speed.
zotcard-card-manager-setting-exclude_collectionoritem = Collection or Item
zotcard-card-manager-setting-exclude_collectionoritem_message = After setting, all cards under that category or entry are ignored. <br> Too much neglect may affect the loading speed.
zotcard-card-manager-help = Help
zotcard-card-manager-help-message = First, regarding the performance, if you use this function, it is recommended that you <br>1, as little as possible to load the card. <br>2, close "Settings" - "parse" and empty "Settings" - "ignore" as much as possible, so that the card will not be parsed and ignored when loading. <br>3, the interface has been optimized, screen by screen loading, as far as possible to reduce all loading display. <br> 2. About the parsing, the detailed explanation has been in the "Settings" - "parsing" each configuration items, if the parsing fails, you can modify the card content. Other questions can be fed back to the developer, please check the contact information in Zotero "Settings" - "ZotCard".

zotcard-card-manager-show_card_viewer-in_the = at
zotcard-card-manager-show_card_viewer-in_the2 = ,
zotcard-card-manager-show_card_viewer-in_the_card = cards.
zotcard-card-manager-show_card_viewer-cancel = Cancel
zotcard-card-manager-show_card_viewer-open = Open
zotcard-card-manager-show_card_viewer-all = All
zotcard-card-manager-show_card_viewer-random = Random
zotcard-card-manager-show_card_viewer-selectbefore = Select before
zotcard-card-manager-show_card_viewer-selectafter = Select after


