# DOCSIS WIDE WEB UI - Release notes
   Based https://bitbucket.kaonmedia.com/scm/kaon-webui/web-ui.git:wide_docsis
## current (version unknown)
* FIX UI loading slowly // JIra CGTMAG-26
   : dashboard page, change view rx/tx with button 

* WPS page
   : FIX wps button not work // Jira CGTMAG-29

* Magyar Telekom build customization // Jira CGTMAG-31
   : ADD cm downstream start search frequency operation according to online/offline (check every 5 seconds)
   : DELETE wan connection type
   : DELETE dns settings
   : DELETE advanced option-remote config management, multicast
   : DELETE mac passthrough
   : DELETE firmware upgrade

* Main(Primary) WiFi page
   : ADD ssid length check function (1~32) // Jira CGTMAG-7

* language translation
   : FIX login, ddns, dmz, lte transition // Jira CGTMAG-30
   : UPDATE english, hugarian, deutsch
## v1.01.09
* Spectrum Analyzer
   : DELETE button. // Jira Kaon CGTMAG-1 (No.01)

* Main(Primary) WiFi page
   : DELETE encryption(security) 'none' option. // Jira Magyar KCG-29

* Modify ID page
   : ADD password hidden option. // Jira Kaon CGTMAG-6

* LTE backup page
   : DELETE hardcoded values
   : ADD lte rpc call function

* Minidlna page
   : CHANGE usb mount point media/usb/* -> data/usb/*

* Samba page
   : CHANGE usb mount point media/usb/* -> data/usb/*

* Connected Device page
   : FIX typo

## v1.01.08
* WEB style was change BLUE -> WIDE

* ADD overall docsis page