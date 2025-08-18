export async function fetchBudgetData() {
  const urlGet = "https://data.ssb.no/api/pxwebapi/v2-beta/tables/10487/data?lang=no&valueCodes[Hovedpost]=INNT.IALT,INNT.SALG,INNT.DR_RES_PETROL,INNT.AVSKR_PETROL,INNT.AVSKR_FORRETN,INNT.ANDRE_BYGG,INNT.OVERF_IALT,INNT.SKATT_AVG,INNT.MEDL_PR,INNT.ARB_G_AVG,INNT.RENTER_UTB,INNT.ANDRE_STATL,INNT.KOMM_FYLK,INNT.NORGES_BANK,INNT.ANDRE_OVERF,UTG.IALT,UTG.DRIFT_IALT,UTG.LONN,UTG.VARER_TJ,UTG.ANDRE_DRIFT,UTG.DR_RES_FORRETN,UTG.BYGG_IALT,UTG.BYGG_PETROL,UTG.BYGG_FORRETN,UTG.BYGG_ELLERS,UTG.OVERF_IALT,UTG.ANDRE_STATL,UTG.KOMM_FYLK,UTG.PENSJ_TRYGD,UTG.RENTER,UTG.ANDRE_OVERF,OF_PETROL_FOND,PETROL_FOND,OFL,UTLAN,AVDRAG,FIN_BEHOV&valueCodes[ContentsCode]=Belop&valueCodes[Tid]=2025";
  try {
    const res = await fetch(urlGet);
    const json = await res.json();
    if (!res.ok) throw new Error("Failed to fetch budget data");
    return json;
  } catch {
  const urlPost = "/ssb-api/api/v0/no/table/10487";
    const body = {
  "query": [
    {
      "code": "Tid",
      "selection": {
        "filter": "item",
        "values": [
          "2025"
        ]
      }
    }
  ],
  "response": {
    "format": "json-stat2"
  }

    };
    const resFallback = await fetch(urlPost, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!resFallback.ok) throw new Error("Failed to fetch budget data with fallback");
    return resFallback.json();
  }
}