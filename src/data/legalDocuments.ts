/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SacredSteps: Daily Grace — Official Legal & Privacy Documentation
 * Written for faith-based recovery, zero-knowledge encryption, and clinical guardrails.
 */

export interface LegalSection {
  id: string;
  title: string;
  summary: string;
  content: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  badge: string;
  intro: string;
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  subtitle: "Zero-Knowledge Spiritual Sanctuary & Data Covenant",
  lastUpdated: "September 28, 2026",
  effectiveDate: "September 2026",
  badge: "AES-256 Client-Side Encrypted • Zero Data Profiling",
  intro: "At SacredSteps: Daily Grace, we believe recovery is sacred ground. Shame thrives in fear and exposure, but genuine spiritual transformation requires an environment of absolute safety, dignity, and confidentiality. This Privacy Policy details our unwavering technical and ethical commitment: we do not monetize your vulnerabilities, we do not profile your struggles, and we cannot read your personal recovery entries.",
  sections: [
    {
      id: "zero-knowledge",
      title: "1. Zero-Knowledge Client Encryption Architecture",
      summary: "Your reflections and 12-step inventories never leave your device unencrypted.",
      content: [
        "SacredSteps is engineered with a strict Zero-Knowledge Architecture. All private journal entries, Step 4 moral inventories, Step 8/9 amends ledgers, and craving triggers are encrypted directly in your browser or local device environment using military-grade Advanced Encryption Standard in Galois/Counter Mode (AES-GCM 256-bit).",
        "Encryption keys are derived via PBKDF2 (Password-Based Key Derivation Function 2) utilizing 100,000 hashing rounds with cryptographically secure random salts (generated via the Web Cryptography API crypto.getRandomValues).",
        "Your master passphrase and decryption keys exist exclusively in volatile memory (RAM) while you are actively logged into your vault. Once you close the tab, lock the vault, or background the app, keys are purged from memory.",
        "Crucially: SacredSteps servers, developers, and administrators possess NO backdoor, master key, or decryption mechanism. Even under legal process or server inspection, your plaintext entries cannot be accessed by our team."
      ]
    },
    {
      id: "data-collected",
      title: "2. Information We Collect (and Do Not Collect)",
      summary: "We collect only anonymous local operational state. No medical records or tracking pixels.",
      content: [
        "Data Stored Exclusively on Your Device: Your clean date timestamp (to track Days in Grace milestones), completed step flags, custom milestone reflections, audio preferences, and irreversible cryptographic PIN salt/hash pairs are stored locally in your device storage (IndexedDB/localStorage).",
        "Data We NEVER Collect: We do not collect medical history, psychiatric records, health insurance information, government IDs, physical biometric prints (biometric authentication utilizes your device's native local WebAuthn/Secure Enclave hardware and never shares prints with us), or precise GPS tracking.",
        "No Data Brokering or Advertising: We do not use advertising identifiers (IDFA/GAID), tracking pixels (such as Facebook Pixel or ad trackers), or behavioral marketing cookies. We never sell, rent, or trade your data to insurance companies, data brokers, or third parties."
      ]
    },
    {
      id: "ai-spiritual-guide",
      title: "3. 'The Guide' & Sacred S.T.E.P. Method™ Processing",
      summary: "Ephemeral spiritual assistance without prompt storage or model training.",
      content: [
        "When you engage with 'The Guide' to dismantle lies, shame, or fear using the Sacred S.T.E.P. Method™ (Scripture, Truth, Embrace, Practice), your prompt is processed ephemerally solely to return the relevant scripture, truth affirmation, and micro-action.",
        "Your confidential spiritual questions are NEVER logged into long-term user training sets, NEVER sold to model aggregators, and NEVER associated with an identifiable personal profile.",
        "On-device pattern detection (such as spiritual theme recognition and emotional recovery trajectory tracking) runs locally in your browser memory without transmitting your journals to external servers."
      ]
    },
    {
      id: "sponsor-sharing",
      title: "4. Voluntary Sponsor Review Protocol",
      summary: "You hold total control over when, how, and with whom your reflections are shared.",
      content: [
        "Recovery often thrives in trusted fellowship. If you choose to share a Step 5 reflection or moral inventory with your recovery sponsor, SacredSteps generates an encrypted, client-side export package protected by an independent sponsor key of your choosing.",
        "Transmission occurs directly between you and your sponsor via your chosen communication channel (such as a secure URL fragment #sponsor-entry= or encrypted file). SacredSteps does not store or broker these shared files on remote servers."
      ]
    },
    {
      id: "crisis-protocol",
      title: "5. Crisis Lifeline & Safety Intervention",
      summary: "Immediate connection to licensed lifelines (988) without punitive surveillance.",
      content: [
        "SacredSteps incorporates client-side safety guardrails. If input indicates intent to commit self-harm or a severe medical crisis, the app immediately pauses spiritual devotions to present direct contact details for the 988 Suicide & Crisis Lifeline and emergency services.",
        "We do not report your identity or geolocate your device to law enforcement. The crisis buttons trigger standard system telephone (tel:) and SMS (sms:) links handled privately by your device's operating system."
      ]
    },
    {
      id: "user-rights",
      title: "6. User Sovereignty & The Right to Instant Purge",
      summary: "Complete data portability, GDPR/CCPA compliance, and permanent wipe capabilities.",
      content: [
        "Right to Access & Portability: You may export your complete encrypted recovery records, journal entries, and milestone logs at any time in standard JSON format for offline safeguarding.",
        "Right to Total Erasure (One-Click Purge): You have the absolute right to instant digital oblivion. Using the 'Reset / Purge' option in the settings immediately and irrevocably deletes all local database records, cryptographic keys, and cached devotions from your browser and device.",
        "Compliance: We respect all applicable global privacy frameworks, including the European Union General Data Protection Regulation (GDPR), California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA), and CalOPPA."
      ]
    },
    {
      id: "children-privacy",
      title: "7. Protection of Minors (COPPA)",
      summary: "Intended for adults 18 and older or minors under parental guidance.",
      content: [
        "SacredSteps is designed for individuals aged 18 and older seeking adult recovery and spiritual renewal. We do not knowingly solicit or collect information from children under the age of 13 in accordance with the Children's Online Privacy Protection Act (COPPA). If you believe a child has provided unauthorized data, please contact us immediately for instant purging."
      ]
    },
    {
      id: "contact",
      title: "8. Data Protection & Inquiries",
      summary: "Reach our dedicated privacy stewards.",
      content: [
        "For questions regarding our cryptographic architecture, privacy covenant, or data rights, please contact our team at: privacy@sacredstepsrecovery.com or write to: SacredSteps Ministries, Attention: Data Privacy Steward, P.O. Box 4120, Atlanta, GA 30302."
      ]
    }
  ]
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  title: "Terms and Conditions",
  subtitle: "Spiritual Covenant, Terms of Use & Legal Guardrails",
  lastUpdated: "September 28, 2026",
  effectiveDate: "September 2026",
  badge: "Faith-Based Devotional Companion • Not Medical Advice",
  intro: "Welcome to SacredSteps: Daily Grace. These Terms and Conditions constitute a legally binding agreement between you ('User' or 'You') and SacredSteps / C. Lamont Patrick ('We', 'Us', or 'Our'). By accessing, using, or interacting with the SacredSteps web or mobile platform, you acknowledge that you have read, understood, and agree to be bound by all of the terms set forth herein.",
  sections: [
    {
      id: "medical-disclaimer",
      title: "1. CRITICAL MEDICAL, PSYCHIATRIC & CLINICAL DISCLAIMER",
      summary: "SacredSteps is a spiritual devotional tool, NOT a doctor, therapist, or detox center.",
      content: [
        "NOT CLINICAL HEALTHCARE: SacredSteps: Daily Grace, including 'The Guide', the Daily Anchor, the Interactive 12-Step Journal, and audio meditations, is designed solely for spiritual encouragement, personal reflection, and faith-based peer support.",
        "NO DOCTOR-PATIENT RELATIONSHIP: Use of SacredSteps does not establish a doctor-patient, therapist-client, psychiatric, or healthcare provider relationship of any kind.",
        "NO MEDICAL ADVICE OR DIAGNOSIS: The content, affirmations, prayers, and interactive tools provided in this app DO NOT constitute professional medical advice, psychiatric diagnosis, clinical psychotherapy, or addiction treatment programs.",
        "LIFE-THREATENING WITHDRAWAL WARNING: Substance withdrawal (specifically from alcohol, benzodiazepines, opioids, barbiturates, and other chemical dependencies) can cause severe, life-threatening physical complications, seizures, delirium tremens, and cardiovascular distress. SACREDSTEPS CANNOT AND DOES NOT PROVIDE MEDICAL DETOXIFICATION. If you are experiencing acute withdrawal, you must seek immediate care at an accredited medical detoxification center or hospital emergency room.",
        "CONSULT YOUR PHYSICIAN: Always seek the guidance of your physician, licensed addiction counselor, or qualified mental health specialist before modifying any prescribed medication, clinical treatment plan, or medical regimen."
      ]
    },
    {
      id: "crisis-warning",
      title: "2. EMERGENCY CRISIS CLAUSE (CALL 988)",
      summary: "If you are in danger of self-harm or experiencing a medical crisis, pause and reach out immediately.",
      content: [
        "IF YOU ARE IN CRISIS: If you are having thoughts of suicide, self-harm, severe psychiatric distress, or acute physical danger, STOP USING THIS APPLICATION IMMEDIATELY and contact emergency services:",
        "• United States & Canada: Call or text 988 (Suicide & Crisis Lifeline - free, 24/7, confidential).",
        "• Emergency Services: Dial 911 (US/Canada), 999 (UK), 112 (Europe), or proceed immediately to the nearest hospital emergency room.",
        "• Substance Abuse Helpline: Call SAMHSA's National Helpline at 1-800-662-4357 for 24/7 treatment referral.",
        "SacredSteps is not a crisis response hotline and cannot dispatch first responders or provide emergency rescue."
      ]
    },
    {
      id: "intellectual-property",
      title: "3. Intellectual Property & Sacred S.T.E.P. Method™ License",
      summary: "Proprietary book writings, frameworks, and trademarks of C. Lamont Patrick.",
      content: [
        "All materials contained within SacredSteps—including but not limited to the trademarked Sacred S.T.E.P. Method™ (Scripture, Truth, Embrace, Practice), book excerpts authored by C. Lamont Patrick, 'A Path to Recovery, A Life in Grace' taglines, devotional prayers, audio voiceprints, typography systems, and UI architecture—are the proprietary intellectual property of C. Lamont Patrick and SacredSteps.",
        "Limited Personal License: We grant you a revocable, non-exclusive, non-transferable, personal license to view, listen, and journal within the application for your own individual spiritual renewal.",
        "Prohibited Commercial Use: You may not reproduce, syndicate, sell, reverse engineer, scrape, republish, or commercially exploit any framework, prayer, devotional, or code without prior express written authorization from the copyright holder."
      ]
    },
    {
      id: "encryption-custody",
      title: "4. Zero-Knowledge Cryptographic Key Custody & User Responsibility",
      summary: "You are the sole custodian of your master PIN. Forgotten passphrases cannot be recovered.",
      content: [
        "Due to our Zero-Knowledge security architecture, SacredSteps does not store or escrow your master encryption PIN or passphrase on any server.",
        "You acknowledge and agree that YOU BEAR EXCLUSIVE RESPONSIBILITY FOR MEMORIZING OR SAFEKEEPING YOUR PIN/PASSPHRASE.",
        "INABILITY TO RECOVER FORGOTTEN PASSCODES: If you forget your passphrase or lose your encryption credentials, neither SacredSteps nor our technical staff can decrypt or retrieve your locked journal entries. You expressly release SacredSteps from any liability or damages resulting from permanent data lockouts caused by lost passphrases."
      ]
    },
    {
      id: "user-conduct",
      title: "5. Permitted Use & Code of Fellowship",
      summary: "Honest engagement, no malicious exploitation, respect for the digital sanctuary.",
      content: [
        "By using the platform, you agree to engage with the fellowship in good faith. You agree not to:",
        "• Attempt to inject malicious scripts, reverse-engineer encryption routines, or disrupt sanctuary servers.",
        "• Misrepresent yourself when sharing sponsor links or attempt to decrypt another individual's recovery exports without authorization.",
        "• Exploit any feature for commercial solicitation, spam, or unlawful purposes."
      ]
    },
    {
      id: "warranty-disclaimer",
      title: "6. Disclaimer of Warranties ('As Is' and 'As Available')",
      summary: "Spiritual growth is a personal journey; no guarantee of sobriety outcomes.",
      content: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, SACREDSTEPS: DAILY GRACE IS PROVIDED ON AN 'AS IS' AND 'AS AVAILABLE' BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, FREEDOM FROM COMPUTER VIRUSES, OR NON-INFRINGEMENT.",
        "WHILE WE FERVENTLY PRAY FOR AND BELIEVE IN YOUR FREEDOM AND HEALING, WE DO NOT GUARANTEE THAT USE OF THIS APP WILL PREVENT RELAPSES, ENSURE CONTINUOUS SOBRIETY, OR PRODUCE SPECIFIC PSYCHOLOGICAL OUTCOMES. RECOVERY DEMANDS DILIGENT EFFORT, COMMUNITY, AND OFTEN CLINICAL MEDICAL INTERVENTION."
      ]
    },
    {
      id: "limitation-liability",
      title: "7. Limitation of Liability",
      summary: "Capped liability to the fullest extent allowed by law.",
      content: [
        "UNDER NO CIRCUMSTANCES SHALL SACREDSTEPS, ITS CREATORS, AUTHORS, CONTRIBUTORS, DIRECTORS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA, MEDICAL EXPENSES, RELAPSE COMPLICATIONS, OR EMOTIONAL DISTRESS) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE APPLICATION.",
        "YOUR SOLE AND EXCLUSIVE REMEDY FOR DISSATISFACTION WITH THE APPLICATION IS TO STOP USING SACREDSTEPS AND PURGE YOUR LOCAL DATA."
      ]
    },
    {
      id: "indemnification",
      title: "8. Indemnification",
      summary: "Protection against unauthorized claims.",
      content: [
        "You agree to defend, indemnify, and hold harmless SacredSteps, C. Lamont Patrick, and their respective officers, partners, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your violation of these Terms or misuse of the platform."
      ]
    },
    {
      id: "governing-law",
      title: "9. Governing Law & Dispute Resolution",
      summary: "Informal spiritual reconciliation followed by binding arbitration.",
      content: [
        "These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, without regard to its conflict of law principles.",
        "Dispute Resolution: In the spirit of Matthew 18, both parties agree to first attempt in good faith to resolve any dispute, claim, or controversy through informal dialogue. If unresolved within 60 days, disputes shall be settled through binding arbitration administered in Atlanta, Georgia."
      ]
    },
    {
      id: "modifications",
      title: "10. Modifications to Terms & Contact Information",
      summary: "Updates posted transparently with renewed effective dates.",
      content: [
        "We reserve the right to revise these Terms periodically. Substantive updates will be reflected in the app with an updated 'Effective Date'. Continued use of SacredSteps constitutes acceptance of revised Terms.",
        "Contact: For inquiries regarding these Terms and Conditions, please email us at: legal@sacredstepsrecovery.com or contact: SacredSteps Ministries, Legal Counsel, P.O. Box 4120, Atlanta, GA 30302."
      ]
    }
  ]
};
