# LabOrdering

This project interfaces a chrome extension and chat bot with a Google Spreadsheet
to enable streamlined ordering. This application was developed for use in
the Tufts University SilkLab.

![orderextensionsmaller2](https://cloud.githubusercontent.com/assets/480305/16212250/6952c406-3714-11e6-95cd-d1d299e66486.png)
Trademarks: All trademarks and registered trademarks are the property of their respective owners.

## Extension and Backend
The extension uses JS to scrape McMaster, Digikey, Fisher Scientific, Sigma Aldrich,
and Amazon for the product description, price, and SKU. The user is
then presented with a form which allows them to fill in the quantity and the
End User (for keeping track of grants or POs). Once submitted it is then added
to the appropriate sheet of a Google Spreadsheet.

Example Sheet:
https://docs.google.com/spreadsheets/d/14F_PsbFHJT136J0mbI-Ud6NvmRQeJIPWxNKDkKyUFWo/edit?usp=sharing

If the ExtensionBackend.gs script is run by the end user, the Spreadsheet can
also keep track of the GMail account for security purposes.

## HUBOT script
This script allows *reordering* of previously ordered items. The intended use
case is for reordering consumables while on the go. An example conversation is
as follows:

>  Example User: order more acetone

>  HUBOT: @ExampleUser Here are previously ordered supplies:
  0: 31.48 -- Acetone, 99.5%, 1 Gallon

>  Example User: 0

>  HUBOT: @ExampleUser Ordering more of:
  Acetone, 99.5%, 1 Gallon
  How many do you want?

>  Example User: 1

>  HUBOT: @ExampleUser Ordering 1 more of:
  Acetone, 99.5%, 1 Gallon
  Who is the order for (the end user)?

>  Example User: Example User

>  HUBOT: @ExampleUser Ordering 1 more of:
  Acetone, 99.5%, 1 Gallon
  for Example User
  Reply yes to order!

>  Example User: yes

>  HUBOT: @ExampleUser Added 1 of:
  Acetone, 99.5%, 1 Gallon"
   to the Lab Order Site for: Example User
   at: Sun Jun 19 2016 12:13:17 GMT-0400 (EDT)

 This script makes use of the [hubot-conversation](https://github.com/lmarkus/hubot-conversation) package.
 An example package.json has been provided for reference. 

 A new bot is now using the Hubot slack integration.

## Known Issues
+ If Google App Script has the user run the script, the user has to have access to the spreadsheets
+ APIs are not fully JSON parseable yet
+ HUBOT script does not handle unexpected input gracefully
+ Initial Google user login is clunky (opens two new popups for OAuth)
+ Mix of Javascript and JQuery Syntax
