
$(document).ready(function () {

    ///刪除
    function deleteBook(e) {
        var Check = confirm('確定是否刪除這筆紀錄?');
        if (Check == true) {
            e.preventDefault();
            var grid = $("#book_grid").data("kendoGrid");
            var row = grid.dataItem(event.target.closest("tr"));
            var ID = row.BookID;;
            //console.log(ID);
            $.ajax({
                type: "POST",
                url: "/Book/DeleteBook",
                data: "BookID=" + ID,
                dataType: "json",
                success: function (response) {
                    if (response == true) {
                        grid.dataSource.remove(row);
                        alert("圖書已刪除");
                    } else {
                        alert("書本借出中，請待歸還後再進行刪除");
                    }
                },
                error: function (error) {
                    alert("系統發生錯誤");
                }
            });
        }
    };

    newDropDownList("book_category");
    newDropDownList("book_keeper");
    newDropDownList("book_status");

    ///取 DropDownList
    function newDropDownList(list) {
        $("#" + list).kendoDropDownList({
            optionLabel: "請選擇項目",
            dataTextField: "Text",
            dataValueField: "Value",
            dataSource: {
                transport: {
                    read: {
                        url: "/Book/GetDropDownList",
                        type: "post",
                        dataType: "json",
                        data: { category: list }
                    }
                }
            }
        });
    };

    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        min: "1900/01/01",
        max: new Date(),
        format: "yyyy/MM/dd"
    });
    $("#bought_datepicker").attr("readonly", "readonly");//唯讀

    ///清除輸入
    ///清除輸入
    ///清除輸入
    $("#clear").click(function () {
        $("#book_name").val("");
        $("#book_category").data("kendoDropDownList").select(0);
        $("#book_keeper").data("kendoDropDownList").select(0);
        $("#book_status").data("kendoDropDownList").select(0);
    });

    //查詢
    //查詢
    //查詢
    $("#search").click(function () {
        var BookName = $("#book_name").val();
        var BookClassName = $("#book_category").data("kendoDropDownList").value();
        var UserName = $("#book_keeper").data("kendoDropDownList").value();
        var CodeName = $("#book_status").data("kendoDropDownList").value();
        var grid = $("#book_grid").data("kendoGrid");
        if (grid != null) {
            grid.destroy();
        };
        $("#book_grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Book/GetSearchResult",
                        type: "post",
                        dataType: "json",
                        data: { BookName, BookClassName, UserName, CodeName }
                    }
                },
                schema: {
                    model: {
                        fields: {
                            BookClassName: { type: "string" },
                            BookName: { type: "string" },
                            BookBoughtDate: { type: "string" },
                            CodeName: { type: "string" },
                            UserName: { type: "string" },
                        },
                    },
                },
                pageSize: 20,
            },
            height: 550,
            sortable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                { field: "BookClassName", title: "圖書類別", width: "15%" },
                { field: "BookName", title: "書籍名稱", width: "40%" },
                { field: "BookBoughtDate", title: "購買日期", width: "15%" },
                { field: "CodeName", title: "書籍狀態", width: "15%" },
                { field: "UserName", title: "借閱人", width: "15%" },
                { command: { text: "借閱紀錄", click: JumpRecord }, title: " ", width: "120px" },
                { command: { text: "修改", click: JumpUpdate }, title: " ", width: "120px" },
                { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
            ]
        });
    })

    //借閱的視窗
    $("#lendRecordWindow").kendoWindow({
        width: "1000px",
        height: "480px",
        title: "借閱紀錄",
        visible: false,
        modal: true
    }).data("kendoWindow")

    ///跳到借閱紀錄
    function JumpRecord(e) {
        e.preventDefault();
        var grid = $("#book_grid").data("kendoGrid");
        var row = grid.dataItem(event.target.closest("tr"));
        var ID = row.BookID;
        var lendRecordWindow = $("#lendRecordWindow");
        lendRecordWindow.kendoWindow().data("kendoWindow").center().open();
        console.log(ID);


        //內部grid
        $("#lend_grid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Book/BookLendRecord",
                        type: "post",
                        dataType: "json",
                        data: { BookID: ID }
                    }
                },
                pageSize: 10,
            },
            height: 550,
            sortable: true,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                { field: "BookName", title: "書籍名稱", width: "35%" },
                { field: "UserID", title: "借閱人員編號", width: "20%" },
                { field: "UserName", title: "借閱人", width: "15%" },
                { field: "LendDate", title: "借閱日期", width: "30%" }
            ]
        })
    }

    function JumpUpdate() {
        var grid = $("#book_grid").data("kendoGrid");
        var row = grid.dataItem(event.target.closest("tr"));
        var ID = row.BookID;
        window.location.href = "/Book/UpdateBook?BookID=" + ID
    }
})