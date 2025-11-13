


await the menus from wp(yet to be implemented). 



Stlye
apply 80%, 70% width and fix the color thing,
better color. 

more contained text in author. Better font
Fix better style, category, author. Better style, font, sizes, colors. Hem > Företag, we remove the one in the middle. Remove the excerpt, remove the border-radious and border. Fix a sidebar, with ads, signup to emails.


main page style everything takes huge amount of space. 

Fix a better Populära inlägg, Liknar dagensps, fix better, 
Fix the style of the readpeak inside of category

Post: 
Breadcrumb add hem. The date and share_button fix them together. 

WE have to check in nextjs a way to display variants of an image. So that for example smaller images can take full width without looking ugly. 

TOC; fix better style and smother animtion. 
Make the text more contained,  for example 80%, of the parent width. 
Fix a better style, for senaste nyheter.

The seo of the main page is being fetched, i think it is the getWpSeo that casuses it. 

404-page: 
https://new-finanstidning-se.vercel.app/nyhetsbrev

Fix later
1. The header is not responviness due to the add of more categroies(fix later)


Make sure that the places we have a request we have try/catch
I am also more scared that we are not having fallbacks. 

The button inside the footer has to be connected with the off-page newsletter, like the popup.
Fix the footer once we have the menus. 





GetPostByPeriod:
{
  "id": "25355",
  "databaseId": 25355,
  "slug": "lyxklockor-overtraffar-tillgangar-vaxande-mojlighet",
  "uri": "https://finanstidning.se/lyxklockor-overtraffar-tillgangar-vaxande-mojlighet",
  "status": "publish",
  "author_name": "Redaktionen",
  "category": "FÖRETAG",
  "title": "Lyxklockor överträffar tillgångar: En växande möjlighet",
  "excerpt": "Lyxklockor överträffar traditionella tillgångar: En växande investeringsmöjlighet Lyxklockor har under de senaste åren visat sig vara en stark investeringsmöjlighet, särskilt i tider av ekonomisk osäkerhet och volatila aktiemarknader. Timetrade Investments, en ledande aktör inom förvaltning av lyxklockor, har sedan 2019 sett sina portföljer öka med över 300 procent för låga till medelriskprofiler. Denna tillgångsklass har [&hellip;]",
  "date": "2025-10-25T13:09:30+02:00",
  "featuredImage": {
    "node": {
      "id": 25354,
      "sourceUrl": "https://cms.finanstidning.se/wp-content/uploads/2025/10/lyxklockor-tillgangarimage-300x169.jpg",
      "altText": ""
    }
  },
  "author": {
    "node": {
      "id": "1",
      "name": "Redaktionen",
      "slug": "redaktionen"
    }
  },
  "categories": {
    "nodes": [
      {
        "id": 146,
        "name": "FÖRETAG",
        "slug": "foretag"
      }
    ]
  },
  "tags": {
    "nodes": []
  }
},

We use featuredImage: src, alttag , category: name, title, excerpt, id, slug




Todays posts: 
{
  "id": "25500",
  "databaseId": 25500,
  "slug": "relevator-sverige-ab-cirkular-lagerautomation",
  "uri": "https://finanstidning.se/relevator-sverige-ab-cirkular-lagerautomation",
  "status": "publish",
  "author_name": "Redaktionen",
  "category": "FÖRETAG",
  "title": "Relevator Sverige AB: En pionjär inom cirkulär lagerautomation",
  "excerpt": "Relevator Sverige AB: En pionjär inom cirkulär lagerautomation Relevator Sverige AB har nått finalen i Återvinningsgalan 2025, där de tävlar om utmärkelsen Årets Återanvändare. Denna prestigefyllda nominering erkänner företagets innovativa bidrag till ökad cirkularitet och minskat avfall inom industrin. En ny marknad för hållbarhet &#8220;Att bli en av finalisterna till Årets Återanvändare är ett bevis [&hellip;]",
  "date": "2025-10-29T11:39:23+02:00",
  "featuredImage": {
    "node": {
      "id": 25499,
      "sourceUrl": "https://cms.finanstidning.se/wp-content/uploads/2025/10/cirkular-lagerautomationimage-300x200.jpg",
      "altText": ""
    }
  },
  "author": {
    "node": {
      "id": "1",
      "name": "Redaktionen",
      "slug": "redaktionen"
    }
  },
  "categories": {
    "nodes": [
      {
        "id": 146,
        "name": "FÖRETAG",
        "slug": "foretag"
      }
    ]
  }
},


WE use categpey name, date, id, slug, title, excerpt. 