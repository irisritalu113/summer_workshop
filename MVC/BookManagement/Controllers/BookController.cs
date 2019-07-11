using System;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace BookManagement.Controllers
{
    public class BookController : Controller
    {
        readonly Models.CodeService codeService = new Models.CodeService();
        readonly Models.BookService bookService = new Models.BookService();


        /// <summary>
        /// 圖書資料查詢
        /// </summary>
        /// <returns></returns>
        [HttpGet()]
        public ActionResult Index()
        {
            return View();
        }

        /// 查詢資料
        [HttpPost()]
        public JsonResult GetSearchResult(Models.BookSearchArg book)
        {
            Models.BookSearchArg getResult = book;
            //getResult.BookName = bookName;
            //getResult.BookClassName = bookClassName;
            //getResult.UserName = userName;
            //getResult.CodeName = codeName;
            List<Models.Books> getBook = new List<Models.Books>();
            getBook = bookService.GetBookByCondtioin(getResult);
            return Json(getBook);
        }

        ///GetDropDownList
        ///return list
        [HttpPost()]
        public JsonResult GetDropDownList(string category)
        {
            List<SelectListItem> getCategory = new List<SelectListItem>();
            switch (category)
            {
                case "book_category":
                    getCategory = this.codeService.GetBookClassName();
                    break;
                case "book_keeper":
                    getCategory = this.codeService.GetUserName();
                    break;
                case "book_status":
                    getCategory = this.codeService.GetCodeName();
                    break;
            }
            return Json(getCategory);
        }

        /// <summary>
        /// 新增圖書
        /// </summary>
        /// <param name="book"></param>
        /// <returns></returns>
        [HttpGet()]
        public ActionResult InsertBook(Models.Books book)
        {
            return View();
        }

        /// <summary>
        /// 新增圖書畫面
        /// </summary>
        /// <returns></returns>
        [HttpPost()]
        public ActionResult InsertBook(string bookName, string bookAuthor, string bookPublisher, string bookNote, string bookBoughtDate, string BookClassName)
        {
            Models.Books bookData = new Models.Books();
            bookData.BookName = bookName;
            bookData.BookAuthor = bookAuthor;
            bookData.BookPublisher = bookPublisher;
            bookData.BookNote = bookNote;
            bookData.BookBoughtDate = bookBoughtDate;
            bookData.BookClassID = BookClassName;
            if (ModelState.IsValid)
            {
                try
                {
                    DateTime dateTime = DateTime.Parse(bookData.BookBoughtDate);
                    int BookID = bookService.InsertBook(bookData);
                    return RedirectToAction("BookData", new { BookID = BookID });
                }
                catch
                {
                    Response.Write("<script language=javascript>alert('日期格式錯誤')</script>");
                }
            }
            return View(bookData);
        }

        /// <summary>
        /// 刪除圖書
        /// </summary>
        /// <param name="BookID"></param>
        /// <returns></returns>
        [HttpPost()]
        public JsonResult DeleteBook(int BookID)
        {
            try
            {
                var num = bookService.DeleteBook(BookID);
                if(num > 0)
                {
                    return this.Json(true);
                }
                else
                {
                    return this.Json(false);
                }
                
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// 明細圖書畫面
        /// </summary>
        /// <param name="BookID"></param>
        /// <returns></returns>
        [HttpGet()]
        public ActionResult BookData(int BookID)
        {
            Models.Books books = bookService.GetBookDetail(BookID).FirstOrDefault();
            return View(books);
        }

        [HttpGet()]
        public ActionResult UpdateBook(int BookID)
        { 
            return View();
        }

        /// <summary>
        /// 修改圖書畫面
        /// </summary>
        /// <param name="BookID"></param>
        /// <returns></returns>
        [HttpPost()]
        public JsonResult GetBook(int BookID)
        {
            
            Models.Books books = bookService.GetBookData(BookID).FirstOrDefault();
            return this.Json(books);
        }

        /// <summary>
        /// 修改圖書存檔
        /// </summary>
        /// <param name="BookID"></param>
        /// <param name="books"></param>
        /// <returns></returns>
        [HttpPost()]
        public ActionResult UpdateBook(int bookID, string bookName, string bookAuthor, string bookPublisher, string bookNote, string bookBoughtDate, string BookClassName, string userName, string codeName)
        {
            Models.Books bookData = new Models.Books();
            bookData.BookID = bookID;
            bookData.BookName = bookName;
            bookData.BookAuthor = bookAuthor;
            bookData.BookPublisher = bookPublisher;
            bookData.BookNote = bookNote;
            bookData.BookBoughtDate = bookBoughtDate;
            bookData.BookClassID = BookClassName;
            bookData.UserID = userName;
            bookData.CodeID = codeName;

            if (ModelState.IsValid)
            {
                try
                {
                    DateTime dateTime = DateTime.Parse(bookData.BookBoughtDate);
                    bookService.UpdateBookData(bookData);
                    return RedirectToAction("BookData", new { BookID = bookData.BookID });
                }
                catch(Exception ex)
                {
                    Response.Write("<script language=javascript>alert('日期格式錯誤')</script>");
                }
            }
            return View(bookData);
        }

        /// <summary>
        /// 借閱紀錄畫面
        /// </summary>
        /// <param name="BookID"></param>
        /// <returns></returns>
        [HttpPost()]
        public JsonResult BookLendRecord(int BookID)
        {
            //Models.Books book = new Models.Books();
            //book.BookID = BookID;
            var record = bookService.GetBookLendRecord(BookID);
            return Json(record);
        }
    }
}