const figures = { kits: 20, kitPriceBdt: 25000, orderBdt: 500000, defectiveKits: 8, negotiatedRefundBdt: 200000 };

export const scenario = {
  status: 'proposed' as const,
  label: 'Illustrative competition scenario',
  supplier: 'Supplier Partnership',
  ...figures,
  facts: [
    'HealthPod BD plans to incorporate as a private limited company for a scalable booth network. The founders would document ownership, director decisions and purchasing authority.',
    `The proposed company orders ${figures.kits} equipment kits from a fictional Bangladeshi partnership supplier. Both supplier partners sign the supply and refund agreements.`,
    `${figures.defectiveKits} kits fail the agreed specifications during inspection. HealthPod documents the defects and keeps those kits out of service.`,
    `The parties negotiate a written return and BDT ${figures.negotiatedRefundBdt.toLocaleString('en-US')} refund for those ${figures.defectiveKits} kits. The supplier issues a firm-account cheque, which is returned for insufficient funds.`
  ]
};

export const laws = [
  { name: 'Companies Act 1994', phase: 'Formation & authority', detail: 'A proposed private company needs proper formation documents and a clear decision about who may buy equipment and settle disputes. Incorporation would not remove every individual duty.' },
  { name: 'Partnership Act 1932', phase: 'The supplier firm', detail: 'The fictional supplier is a partnership. Both partners sign the relevant agreements here. A new claim that one lacked authority requires checking the deed and signatures.' },
  { name: 'Contract Act 1872', phase: 'Promise & breach', detail: 'The written specifications, inspection, negotiated refund, and any supportable loss depend on the agreements and evidence.' },
  { name: 'Sale of Goods Act 1930', phase: 'Inspection & acceptance', detail: 'Whether the kits conform, and whether HealthPod examined or accepted them, affect the possible response. A defect does not always give a right to reject.' },
  { name: 'Negotiable Instruments Act 1881', phase: 'Dishonoured cheque', detail: 'The returned refund cheque raises a separate issue. The instrument, bank memo, notice, service, and procedural dates must be checked before claiming a remedy.' }
];
