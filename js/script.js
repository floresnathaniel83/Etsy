//BASE_URL: https://openapi.etsy.com/v2/listings/active?api_key=y8nv4y2sxrcn4gz139phzteh 
//API_KEY: y8nv4y2sxrcn4gz139phzteh
//
//params: API_KEY, listing_id

var qSelect = function(input) {
	return document.querySelector(input)
}


var ListingsCollection = Backbone.Collection.extend({
	url: "https://openapi.etsy.com/v2/listings/active.js",
	_key: "y8nv4y2sxrcn4gz139phzteh",
	parse: function(rawJSON) {
		return rawJSON.results
		
	}
})

var ListingModel = Backbone.Collection.extend({
	url: function () {
		return "https://openapi.etsy.com/v2/listings/" + this.id + ".js"
	},

	_key: "y8nv4y2sxrcn4gz139phzteh",

	parse: function(rawJSON) {
		return rawJSON.results
	},

	initialize: function (id) {
		this.id = id
	}

})

var ListingsView = Backbone.View.extend ({
	el: qSelect("#container"),

	events: {
		"click .title" : "_handleClick"
	},

	initialize: function(coll) { //>>>this function is run when a new instance is created and a model is passed through the constructor***Important!

		var thisView = this
		this.coll = coll
		var boundRender = this._render.bind(thisView)
		this.coll.on("sync", boundRender)

	},

	/*_handleClick: function(eventObj) {
		var listingDiv = eventObj.target
		window.listingDiv = listingDiv
		location.hash = 'detail/' + listingDiv.getAttribute('data-id')

	},
	*/

	_render: function() {
		var listingArray = this.coll.models
		var htmlString = ""
		for(var i = 0; i < listingArray.length; i++){
			var listingMod = listingArray[i]

			
			htmlString += '<div data-id = "' + listingMod.get("listing_id") + '"class = "listingContainer">'
			htmlString += '<div>' + listingMod.get('title') + '</div>'
			htmlString += '<a href = "#details/' + listingMod.get("listing_id") + '">'
			htmlString += '<img src = "' + listingMod.get("Images")[0].url_170x135 + '"/>' //>>>>Why do my images break unexpectedly?
			htmlString += '<p class = "price">' + '$' + listingMod.get("price") + '</p>'
			htmlString += '</div>'
			
		}

			this.el.innerHTML = htmlString

	}

})

var SingleListingView = Backbone.View.extend ({
	el: qSelect('#container'),

	initialize: function(model) {
		this.model = model
		//console.log(this.model)
		var boundRender = this._render.bind(this)
		this.model.on("sync", boundRender)
	},

	_render: function() {
		var listing = this.model
		var htmlString = ""
		htmlString += '<div class = "singleListing">'
		htmlString += '<img src = "' + listing.models[0].get("Images")[0].url_170x135 + '"/>'
		htmlString += '<div>' + listing.models[0].get("description") + '</div>'
		htmlString += '<p class = "price">' + "$" + listing.models[0].get("price") + '</p>'
		htmlString += '</div>'  

		this.el.innerHTML = htmlString

	}

})

var EtsyRouter = Backbone.Router.extend ({

	routes: {
		"search/:keywords" : "doListingsSearch",
		"details/:listing_id" : "doDetailView", 
		"*catchall" : "showHomePage"

	},

	doListingsSearch: function(searchKeyword) {
		var searchCollection = new ListingsCollection()
		searchCollection.fetch({
			data: {
				api_key: searchCollection._key,
				keywords: searchKeyword
			}

		})
		new ListingsView(searchCollection)
	},

	doDetailView: function(id) {
		var singleListing = new ListingModel(id)
		singleListing.fetch({
			
			dataType:"jsonp",
			data: {
				includes: "Images, Shop",
				api_key: singleListing._key
			}
		})
		
		new SingleListingView(singleListing)

	},

	showHomePage: function() {
		var homeCollection = new ListingsCollection()
		console.log(homeCollection)
		homeCollection.fetch({

			dataType: "jsonp",
			processData: true,	
			data: {
				includes: "Images,Shop",
				api_key: homeCollection._key
				
			}

		})
		new ListingsView(homeCollection)

	},

	initialize: function() {

		Backbone.history.start()

	}
})

new EtsyRouter()

qSelect('input').addEventListener('keydown',function(e) {
	if (e.keyCode === 13) {
		location.hash = "search/" + e.target.value
	}
})
