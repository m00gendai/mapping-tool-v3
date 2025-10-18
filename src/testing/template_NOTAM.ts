import {FAANOTAM} from "../interfaces"
// FAA NOTAM Body

const currentDateTime = new Date()

export const test_NOTAM:FAANOTAM = {
    "facilityDesignator": "LSAS",
    "notamNumber": `W0999/${currentDateTime.getFullYear().toString().substring(2,4)}`,
    "featureName": "International",
    "issueDate": "05/27/2025 1414",
    "startDate": `10/18/2025 0900`,
    "endDate": "PERM",
    "source": "USNS",
    "sourceType": "I",
    "icaoMessage": `W0999/25 NOTAMN\nQ) LSAS/QRRCA/IV/BO/E/000/999/4645N00808E999\nA) LSAS B) 2510180900 C) PERM\nD)SAT 0900-1400\nE) R-AREA LSR11 S-CHANF ACT.`,
    "traditionalMessage": " ",
    "plainLanguageMessage": " ",
    "traditionalMessageFrom4thWord": "R-AREA LSR11 S-CHANF ACT.",
    "icaoId": "LSAS",
    "accountId": "2262",
    "airportName": "SWITZERLAND (FIR/UIR)",
    "procedure": false,
    "userID": 0,
    "transactionID": 76785143,
    "cancelledOrExpired": false,
    "digitalTppLink": false,
    "status": "Active",
    "contractionsExpandedForPlainLanguage": false,
    "keyword": "INTERNATIONAL",
    "snowtam": false,
    "digitallyTransformed": false,
    "messageDisplayed": "concise",
    "hasHistory": false,
    "moreThan300Chars": false,
    "showingFullText": false,
    "locID": 352582,
    "defaultIcao": false,
    "crossoverTransactionID": 0,
    "crossoverAccountID": "",
    "requestID": 0
}