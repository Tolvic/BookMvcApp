using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BookMvcApp.Models;

namespace BookMvcApp.Controllers;

public class HomeController : Controller
{

    public Task<IActionResult> Index()
    {
        return Task.FromResult<IActionResult>(RedirectToAction("Index", "Books"));
    }
    

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}