
var bookDataFromLocalStorage = [];
var addData = 1;
$(function(){
    loadBookData();
    var data = [
        {text:"資料庫",value:"database"},
        {text:"網際網路",value:"internet"},
        {text:"應用系統整合",value:"system"},
        {text:"家庭保健",value:"home"},
        {text:"語言",value:"language"}
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker({
        value : new Date(),
        format : "yyyy-MM-dd"
    });
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: {type:"int"},
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號",width:"10%"},
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]
        
    });
    //過濾並搜尋//
    $(".book-grid-toolbar").on("input",function(){
        $(".book-grid-search").filter(function(){
            $("#book_grid").data("kendoGrid").dataSourc.filter({
                logic: "or" ,
                filters: [
                    { field: "BookId", operator: "eq", value: $(this).val()},       
                    { field: "BookName", operator: "contains", value: $(this).val()},
                    { field: "BookCategory", operator: "contains", value: $(this).val()},
                    { field: "BookAuthor", operator: "contains", value: $(this).val()},
                    { field: "BookBoughtDate", operator: "contains", value: $(this).val()},
                        ]
                    });
        });  
    });
});

var id = 73; //id累加外部宣告//
//新增書籍//
$(function() {
    var myWindow = $("#QAQ");
    var nb = $("#op");
    var n_add = $("#a_b");

    nb.click(function(){
        myWindow.kendoWindow().data("kendoWindow").center().open();
    });

    myWindow.kendoWindow({
        width: "400px",
        height: "540px",
        title: "新增",
        visible: false,
        actions: [
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    }).data("kendoWindow");
    
    function onClose() {
        myWindow.kendoWindow().data("kendoWindow").close();
    }

    var validatable = $("#QAQ").kendoValidator().data("kendoValidator");//新增驗證

    n_add.click(function() {
        if (validatable.validate()) {
            var bc = $("#book_category").data("kendoDropDownList").text();
            var bn = $("#book_name").val();
            var ba = $("#book_author").val();
            var bd = $("#bought_datepicker").val();
            var detail = {
                "BookId":bookDataFromLocalStorage.length + addData,
                "BookCategory":bc,
                "BookName":bn,
                "BookAuthor":ba,
                "BookBoughtDate":bd,
                "BookPublisher":"none",
                }
            bookDataFromLocalStorage.push(detail);
            localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
            loadBookData();
            var s = $("#book_grid").data("kendoGrid");
            s.dataSource.add(detail);
            onClose();
            };
        
        });
       
});
 
function loadBookData(){
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if(bookDataFromLocalStorage == null){
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    }
}
//改圖片//
function onChange(){
    var name = this.value()
    $(".book-image").attr("src","image/" + name + ".jpg")
}
//刪除//
function deleteBook(){
    event.preventDefault();
    var x = this.dataItem($(event.target).closest("tr"));
    var grid = $("#book_grid").data("kendoGrid");
    var a = grid.dataSource.indexOf(x);
    grid.dataSource.remove(x);
    bookDataFromLocalStorage.splice(a,1); //splice(index,num),num = 從index開始要刪除的數量
    localStorage.setItem("bookData",JSON.stringify(bookDataFromLocalStorage));
    loadBookData();
    addData++;
}