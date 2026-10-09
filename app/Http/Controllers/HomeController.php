<?php

namespace App\Http\Controllers;

use App\Services\PublishedMenu;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    public function __invoke(PublishedMenu $menu): View
    {
        return view('index', ['menu' => $menu->get()]);
    }
}
