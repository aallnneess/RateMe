1.) rate.ts - Add new properties

2.) Add new properties in appwrite rateme_database database

3.) member-nav-component.html: 2 x <li> Element hinzufügen. ==> Hier wird das rateTopic gesetzt !

4.) Create new XXXTopic.ts in add-rate/topics... and implements TopicsInterface 

5.) Create new XXXTopicViewComponent in add-rate/topics ===> (nur rüber kopieren im *.TS)

6.) add-rate.ts: normalSend, childSend und editSend die Attribute hinzufügen!

7.) add-rate.ts: switch case hinzufügen

8.) add-rate.html: switch case hinzufügen

9.) Create new XXXViewComponent in rate-card-details/....

10.) Update switch in rate-card-details.component.html....

11.) database.service.ts -> getAllParentRatesWithQuery() 
              -> Zeile 148: Query.equal hinzufügen

12.) FilterPopupComponent 
              -> ngOnInit() form topic hinzufügen
              -> updateCheckbox() case hinzufügen, filterservice updaten....
              -> Html label hinzufügen

rateTopic
