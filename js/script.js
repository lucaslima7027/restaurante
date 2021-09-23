$(function(){
	$('.navbar-toggler').on('blur', function() {
    $('.navbar-toggler').addClass('collapsed');
    $('.navbar-toggler').attr('aria-expanded', 'false');
    $('#navbarSupportedContent').attr('class', 'collapse navbar-collapse');
});

$('#navbarSupportedContent').on('mousedown', function(event) {
    event.preventDefault();
});
});

(function (global){

var dc = {};

var homeHtml = "snippets/home.html";
var allCategoriesUrl = 
"json/categories.json";
var menuCategoriesTitleHtml = "snippets/menu-categories-title.html";
var menuCategoryHtml = "snippets/menu-category.html";
var menuItemsUrl = 
"https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/single-category-title.html";
var menuItemHtml = "snippets/single-category.html";
var aboutHtml = "snippets/about.html";
var awardsHtml = "snippets/awards.html";
var menu = "#menu-btn";
var about = "#about-btn";
var awards = "#awards-btn";




var insertHtml = function(selector, html){
	var targetElement = document.querySelector(selector);
	targetElement.innerHTML = html;
};

var showLoading = function(selector){
	var html = "<div class='text-center'>";
	html += "<img src='images/ajax-loader.gif'></div>";
	insertHtml(selector, html);
};

var insertProperty = function (string, propName, propValue){
	var propToReplace = "{{" + propName + "}}";
	string = string
	.replace(new RegExp(propToReplace, "g"), propValue);
	return string;
}

document.addEventListener("DOMContentLoaded", function(event){
	loadHome();
});

function loadHome () {
	showLoading("#main-content");
	deactiveAll();
		$ajaxUtils.sendGetRequest(
			homeHtml,
			function (responseText) {
				document.querySelector("#main-content")
				.innerHTML = responseText; 
			},
			false);
}

dc.loadAbout = function (aboutHtml){
	showLoading("#main-content");
	activeAbout();
	$ajaxUtils.sendGetRequest(
		aboutHtml,
		function (responseText) {
			document.querySelector("#main-content")
			.innerHTML = responseText; 
		},
		false);	
}

dc.loadAwards = function (awardsHtml){
	showLoading("#main-content");
	activeAwards();
	$ajaxUtils.sendGetRequest(
		awardsHtml,
		function (responseText) {
			document.querySelector("#main-content")
			.innerHTML = responseText; 
		},
		false);	
}

dc.loadMenuCategories = function (){
	showLoading("#main-content");
	activeMenu();
	$ajaxUtils.sendGetRequest(
		allCategoriesUrl, buildAndShowCategoriesHTML);
};

dc.loadMenuItens = function (categoryShort) {
	showLoading("#main-content");
	activeMenu();
	$ajaxUtils.sendGetRequest(
		menuItemsUrl + categoryShort, buildAndShowMenuItemsHTML);
};


function buildAndShowCategoriesHTML(categories) {
	$ajaxUtils.sendGetRequest(
		menuCategoriesTitleHtml, 
		function (menuCategoriesTitleHtml) {
			$ajaxUtils.sendGetRequest(
				menuCategoryHtml,
				function(menuCategoryHtml){
					var categoriesViewHtml =
					buildCategoriesViewHtml(categories,
											menuCategoriesTitleHtml,
											menuCategoryHtml);
					insertHtml("#main-content", categoriesViewHtml);
				},
				false);
		},
		false);
};


function buildAndShowMenuItemsHTML (categoryMenuItems) {
	$ajaxUtils.sendGetRequest(
		menuItemsTitleHtml, 
		function (menuItemsTitleHtml) {
			$ajaxUtils.sendGetRequest(
				menuItemHtml,
				function(menuItemHtml){
					var menuItemsViewHtml =
					buildMenuItemsViewHtml(categoryMenuItems,
											menuItemsTitleHtml,
											menuItemHtml);
					insertHtml("#main-content", menuItemsViewHtml);
				},
				false);
		},
		false);
};

function buildCategoriesViewHtml(categories,
								menuCategoriesTitleHtml,
								menuCategoryHtml){

	var finalHtml = menuCategoriesTitleHtml;
	finalHtml += "<section class='row'>";

	for (var i = 0; i < categories.length; i++){
		var html = menuCategoryHtml;
		var name = "" + categories[i].name;
		var short_name = categories[i].short_name;
		html =
		insertProperty(html, "name", name);
		html = 
		insertProperty(html, "short_name", short_name);

		finalHtml += html;
	}

	finalHtml += "</section>";
	return finalHtml;
}


function buildMenuItemsViewHtml(categoryMenuItems,
								menuItemsTitleHtml,
								menuItemHtml){

menuItemsTitleHtml = 
	insertProperty(menuItemsTitleHtml,
					"name",
					categoryMenuItems.category.name);

menuItemsTitleHtml = 
	insertProperty(menuItemsTitleHtml,
					"special_instructions",
					categoryMenuItems.category.special_instructions);


var finalHtml = menuItemsTitleHtml;
	finalHtml += "<section class='row'>";


var menuItems = categoryMenuItems.menu_items;
var catShortName = categoryMenuItems.category.short_name;
for (var i = 0; i < menuItems.length; i++){
	var html = menuItemHtml;
	html = 
	insertProperty(html, "short_name", menuItems[i].short_name);

	html = 
	insertProperty(html, "catShortName", catShortName);

	html = 
	insertItemPrice(html, "price_small", menuItems[i].price_small);

	html = 
	insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);

	html = 
	insertItemPrice(html, "price_large", menuItems[i].price_large);

	html = 
	insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);

	html = 
	insertProperty(html, "name", menuItems[i].name);

	html =
	insertProperty(html, "description",menuItems[i].description);

	finalHtml += html;
};

	finalHtml +="</section>";
	return finalHtml;

};


function insertItemPrice(html,
						pricePropName,
						priceValue){

	if (!priceValue) {
		return insertProperty(html, pricePropName, "");
	};

	priceValue = "$" + priceValue.toFixed(2);
	html = insertProperty(html, pricePropName, priceValue);
	return html;
};

function insertItemPortionName(html,
								portionPropName,
								portionValue){
	if (!portionValue) {
		return insertProperty(html, portionPropName, "");
	};

	portionValue = "(" + portionValue + ")";
	html = insertProperty(html, portionPropName, portionValue);
	return html;
};


function lerHash () {
  return window.location.hash.substring(1);
}


function escreverHash(str) {
  window.location.hash = str;
}


window.onhashchange = function() {
	var str = lerHash();

	escreverHash(str);

	if (str === "menu"){
		$dc.loadMenuCategories();
	}

	if (str === "about"){
		$dc.loadAbout(aboutHtml);
	}

	if (str === "awards"){
		$dc.loadAwards(awardsHtml);
	}

	if (str === ""){
		loadHome();
	}

	else if (str.length <= 3) {
		$dc.loadMenuItens(str);
	}
};

window.onload = function() {
	var str = lerHash();

	escreverHash(str);

	if (str === "menu"){
		$dc.loadMenuCategories();
	}

	if (str === "about"){
		$dc.loadAbout(aboutHtml);
	}

	if (str === "awards"){
		$dc.loadAwards(awardsHtml);
	}

	if (str === ""){
		loadHome();
	}

	else if (str.length <= 3) {
		$dc.loadMenuItens(str);
	}
};

function refresh (){
	var str = lerHash();

	escreverHash(str);

	if (str === "menu"){
		$dc.loadMenuCategories();
	}

	if (str === "about"){
		$dc.loadAbout(aboutHtml);
	}

	if (str === "awards"){
		$dc.loadAwards(awardsHtml);
	}

	if (str === ""){
		loadHome();
	}

	else if (str.length <= 3) {
		$dc.loadMenuItens(str);
	}
}

function activeMenu (){
	$('#menu-btn').addClass('active');
	$('#about-btn').removeClass('active');
	$('#awards-btn').removeClass('active');
}

function activeAbout (){
	$('#about-btn').addClass('active');
	$('#menu-btn').removeClass('active');
	$('#awards-btn').removeClass('active');
	
}

function activeAwards (){
	$('#awards-btn').addClass('active');
	$('#menu-btn').removeClass('active');
	$('#about-btn').removeClass('active');
}

function deactiveAll (){
	$('#menu-btn').removeClass('active');
	$('#about-btn').removeClass('active');
	$('#awards-btn').removeClass('active');
}


global.$dc = dc;

})(window);


