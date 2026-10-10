<?php

namespace App\Http\Controllers;

use App\Services\PublishedMenu;
use App\Services\PublishedStoreHours;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    public function __invoke(PublishedMenu $menu, PublishedStoreHours $hours): View
    {
        return view('index', ['menu' => $menu->get(), 'storeHours' => $hours->get()]);
    }
}
