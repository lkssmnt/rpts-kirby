# RPTS KIRBY

This repository is being updated as the course progresses.

## Get up and running

1. Install Kirby from https://getkirby.com/try
2. Copy content folder from Google Drive
3. Download the folders from this repo and add them to your project
4. To get a local server going, run this in the kirby root folder:\
`php -S localhost:8000 kirby/router.php`

## Web2Print Implementation

1. Download and install css assets.
2. print.css will be automatically integrated in preview mode if its correctly placed in /assets/css
3. give your screen.css an id of "style-screen" to automatically disable it in preview mode
4. copy all JS function, the import statement and the variables
5. run preparePrintInterface in your js file, ideally from your DOMContentLoaded EventListener.
6. checkout the pagedjs documentation for more complex stylig_ https://pagedjs.org/documentation/
7. checkout our codepen for typographic features to be used for text: https://codepen.io/lkssmnt/pen/xxyorWr?editors=1100

## Collection Feature 

1. Create an add-to-collection-button on the detail page (see: projekt.php)
2. Put project information in data-tags of the button. E.g. data-slug, data-title and everthing else you want to display on the collection page
3. create collection page in content folder and collection page template (see: collection.php)
4. see createAddToCollectionBtn function for button functionality
5. see createCollection function for displaying the collection, fetching all pages for the print preview and adding remove buttons for each post
