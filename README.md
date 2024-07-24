Currently i am doing a completionist playthrough and I build this to keep track of what I have or don't have.
--
Inside 'Items' there are Yaml files that contain all items of that type.

Inside 'Html' there are Html files that are the result of 'createPages.js'.

'createPages.js' will get all Yaml files and convert them into Html files where the items are seperated by type and if they are available in Pre-HardMode or HardMode, if a set of items is only available in HardMode or you can get them all in Pre-HardMode there will be no distinction.

The items are also indexed by their position in the chest ~~except armors and vanity sets, they have numbers for no reason~~

All Html file have a button to save your selected items to a file and another button to load the items from a file
