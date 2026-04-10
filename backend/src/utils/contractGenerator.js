// backend/src/utils/contractGenerator.js - Enhanced Contract Generation System
// Note: For PDF generation, you'll need to install pdfkit: npm install pdfkit
import fs from 'fs';
import path from 'path';

// ========== CONTRACT TEMPLATES ==========

const CONTRACT_VERSION = '1.0';
const BIZBRIDGE_TERMS_VERSION = '2024.1';

const COMMON_TERMS = {
  bizBridgeDisclaimer: `
## BIZBRIDGE PLATFORM TERMS

### NO PAYMENT PROCESSING
BizBridge operates as a service marketplace connecting customers with artisans. 
We DO NOT process, handle, or facilitate any payments between parties.

### DIRECT TRANSACTIONS
All financial arrangements, payments, and monetary transactions must be 
handled directly between the Customer and Artisan outside of the BizBridge platform.

### PLATFORM RESPONSIBILITY
BizBridge's role is limited to:
- Facilitating initial contact between parties
- Providing contract templates and agreement tracking
- Offering dispute mediation services (for categorized services only)
- Maintaining service quality standards

### LIABILITY LIMITATION
BizBridge is not responsible for:
- Payment disputes or non-payment issues
- Service quality (except mediation for categorized services)
- Direct financial losses between parties
- Physical damages or injuries during service delivery
`,
  
  disputeResolution: `
## DISPUTE RESOLUTION

### GENERAL DISPUTES
For most disputes, parties should attempt to resolve issues directly through:
1. Direct communication via BizBridge messaging
2. Mutual agreement on revised terms
3. Professional mediation (parties' own arrangement)

### CATEGORIZED SERVICE DISPUTES
For categorized services only, BizBridge provides limited mediation for:
- Service not matching selected category
- Significant deviation from category specifications
- Quality issues related to category standards

### FILING DISPUTES
Disputes can be filed through the BizBridge platform within 30 days of 
service completion or cancellation.
`,

  legalFramework: `
## LEGAL FRAMEWORK

### GOVERNING LAW
This agreement is governed by the laws of Nigeria and Lagos State specifically.

### JURISDICTION
Any legal disputes shall be resolved in Lagos State courts.

### SEVERABILITY
If any part of this contract is found unenforceable, the remainder stays valid.

### MODIFICATION
This contract can only be modified with written agreement from both parties.

### BINDING AGREEMENT
By accepting this contract, both parties agree to be legally bound by these terms.
`
};

// ========== ENHANCED CONTRACT GENERATORS ==========

export const generateFixedPricingContract = (booking, service) => {
  const { customer, artisan, agreement, scheduledDate } = booking;
  
  return `
# SERVICE AGREEMENT CONTRACT
## Fixed Pricing Service

**Contract ID**: ${booking._id}
**Contract Version**: ${CONTRACT_VERSION}
**Generated**: ${new Date().toLocaleString('en-NG')}
**BizBridge Terms Version**: ${BIZBRIDGE_TERMS_VERSION}

---

## CONTRACTING PARTIES

### CUSTOMER
**Name**: ${customer.fullName || customer.name}
**Email**: ${customer.email}
**Contact**: ${customer.phone || 'Not provided'}

### ARTISAN/SERVICE PROVIDER
**Name**: ${artisan.contactName || artisan.businessName}
**Business**: ${artisan.businessName || 'Individual Artisan'}
**Email**: ${artisan.email}
**Phone**: ${artisan.phoneNumber}
**Location**: ${artisan.location?.lga || 'Lagos'}, ${artisan.location?.state || 'Lagos State'}

---

## SERVICE SPECIFICATIONS

### SERVICE DETAILS
**Service Title**: ${service.title}
**Category**: ${service.category}
**Description**: ${booking.description || service.description}

### PRICING TERMS
**Service Type**: Fixed Price Service
**Agreed Price**: ${agreement.agreedTerms.pricing}
**Currency**: Nigerian Naira (₦)
**Price Includes**: As specified in service description
**Payment Terms**: To be arranged directly between parties

### TIMELINE
**Estimated Duration**: ${agreement.agreedTerms.duration}
**Scheduled Start**: ${scheduledDate.startDate.toLocaleDateString('en-NG')}
${scheduledDate.startTime ? `**Start Time**: ${scheduledDate.startTime}` : ''}
${scheduledDate.endDate ? `**Expected Completion**: ${scheduledDate.endDate.toLocaleDateString('en-NG')}` : ''}

### LOCATION & LOGISTICS
**Service Location**: ${agreement.agreedTerms.meetingLocation}
**Logistics**: As mutually agreed between parties

---

## SPECIAL TERMS & CONDITIONS

${agreement.agreedTerms.specialTerms ? `
### ADDITIONAL TERMS
${agreement.agreedTerms.specialTerms}
` : '### ADDITIONAL TERMS\nNo additional terms specified.'}

### FIXED PRICING GUARANTEE
- The price for this service is fixed as agreed
- No additional charges unless scope changes are mutually agreed
- Customer protected from price increases during service delivery
- Any scope changes require written agreement and may affect pricing

---

${COMMON_TERMS.bizBridgeDisclaimer}

---

${COMMON_TERMS.disputeResolution}

---

${COMMON_TERMS.legalFramework}

---

## AGREEMENT ACCEPTANCE

By digitally accepting this contract on the BizBridge platform, both parties acknowledge:
1. They have read and understood all terms
2. They agree to be legally bound by these terms
3. They understand BizBridge does not process payments
4. They will handle all financial transactions directly

### DIGITAL SIGNATURES
**Customer**: ${customer.fullName || customer.name}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.customer ? 
  new Date(agreement.contractAccepted.timestamps.customer).toLocaleString('en-NG') : 'Pending'}

**Artisan**: ${artisan.contactName || artisan.businessName}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.artisan ? 
  new Date(agreement.contractAccepted.timestamps.artisan).toLocaleString('en-NG') : 'Pending'}

---

*This contract was generated by BizBridge Nigeria and is legally binding upon acceptance by both parties.*
`;
};

export const generateNegotiatePricingContract = (booking, service) => {
  const { customer, artisan, agreement, scheduledDate } = booking;
  
  return `
# SERVICE AGREEMENT CONTRACT
## Negotiated Pricing Service

**Contract ID**: ${booking._id}
**Contract Version**: ${CONTRACT_VERSION}
**Generated**: ${new Date().toLocaleString('en-NG')}
**BizBridge Terms Version**: ${BIZBRIDGE_TERMS_VERSION}

---

## CONTRACTING PARTIES

### CUSTOMER
**Name**: ${customer.fullName || customer.name}
**Email**: ${customer.email}
**Contact**: ${customer.phone || 'Not provided'}

### ARTISAN/SERVICE PROVIDER
**Name**: ${artisan.contactName || artisan.businessName}
**Business**: ${artisan.businessName || 'Individual Artisan'}
**Email**: ${artisan.email}
**Phone**: ${artisan.phoneNumber}
**Location**: ${artisan.location?.lga || 'Lagos'}, ${artisan.location?.state || 'Lagos State'}

---

## SERVICE SPECIFICATIONS

### SERVICE DETAILS
**Service Title**: ${service.title}
**Category**: ${service.category}
**Description**: ${booking.description || service.description}

### NEGOTIATED PRICING TERMS
**Service Type**: Negotiated Pricing Service
**Final Agreed Price**: ${agreement.agreedTerms.pricing}
**Currency**: Nigerian Naira (₦)
**Negotiation Date**: ${new Date().toLocaleDateString('en-NG')}
**Price Breakdown**: As discussed and agreed between parties
**Payment Terms**: To be arranged directly between parties

### TIMELINE
**Estimated Duration**: ${agreement.agreedTerms.duration}
**Scheduled Start**: ${scheduledDate.startDate.toLocaleDateString('en-NG')}
${scheduledDate.startTime ? `**Start Time**: ${scheduledDate.startTime}` : ''}
${scheduledDate.endDate ? `**Expected Completion**: ${scheduledDate.endDate.toLocaleDateString('en-NG')}` : ''}

### LOCATION & LOGISTICS
**Service Location**: ${agreement.agreedTerms.meetingLocation}
**Logistics**: As mutually agreed between parties

---

## SPECIAL TERMS & CONDITIONS

${agreement.agreedTerms.specialTerms ? `
### ADDITIONAL TERMS
${agreement.agreedTerms.specialTerms}
` : '### ADDITIONAL TERMS\nNo additional terms specified.'}

### NEGOTIATED PRICING TERMS
- Final pricing has been negotiated and agreed upon by both parties
- Both parties acknowledge the price reflects the scope of work discussed
- Any changes to scope may require price renegotiation
- All price negotiations conducted through BizBridge platform are recorded
- This price supersedes any initial estimates or quotes

### SCOPE CHANGE PROVISIONS
- Changes to original scope require mutual written agreement
- Price adjustments for scope changes must be agreed before implementation
- Documentation of scope changes should be maintained by both parties

---

${COMMON_TERMS.bizBridgeDisclaimer}

---

${COMMON_TERMS.disputeResolution}

---

${COMMON_TERMS.legalFramework}

---

## AGREEMENT ACCEPTANCE

By digitally accepting this contract on the BizBridge platform, both parties acknowledge:
1. They have negotiated the terms in good faith
2. The final price reflects the agreed scope of work
3. They understand BizBridge does not process payments
4. They will handle all financial transactions directly

### DIGITAL SIGNATURES
**Customer**: ${customer.fullName || customer.name}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.customer ? 
  new Date(agreement.contractAccepted.timestamps.customer).toLocaleString('en-NG') : 'Pending'}

**Artisan**: ${artisan.contactName || artisan.businessName}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.artisan ? 
  new Date(agreement.contractAccepted.timestamps.artisan).toLocaleString('en-NG') : 'Pending'}

---

*This contract was generated by BizBridge Nigeria and is legally binding upon acceptance by both parties.*
`;
};

export const generateCategorizedPricingContract = (booking, service) => {
  const { customer, artisan, agreement, scheduledDate } = booking;
  
  return `
# SERVICE AGREEMENT CONTRACT
## Categorized Pricing Service

**Contract ID**: ${booking._id}
**Contract Version**: ${CONTRACT_VERSION}
**Generated**: ${new Date().toLocaleString('en-NG')}
**BizBridge Terms Version**: ${BIZBRIDGE_TERMS_VERSION}

---

## CONTRACTING PARTIES

### CUSTOMER
**Name**: ${customer.fullName || customer.name}
**Email**: ${customer.email}
**Contact**: ${customer.phone || 'Not provided'}

### ARTISAN/SERVICE PROVIDER
**Name**: ${artisan.contactName || artisan.businessName}
**Business**: ${artisan.businessName || 'Individual Artisan'}
**Email**: ${artisan.email}
**Phone**: ${artisan.phoneNumber}
**Location**: ${artisan.location?.lga || 'Lagos'}, ${artisan.location?.state || 'Lagos State'}

---

## SERVICE SPECIFICATIONS

### SERVICE DETAILS
**Service Title**: ${service.title}
**Main Category**: ${service.category}
**Selected Service Category**: ${agreement.agreedTerms.selectedCategory}
**Description**: ${booking.description || service.description}

### CATEGORIZED PRICING TERMS
**Service Type**: Categorized Pricing Service
**Selected Category**: ${agreement.agreedTerms.selectedCategory}
**Category Price**: ${agreement.agreedTerms.pricing}
**Currency**: Nigerian Naira (₦)
**Price Protection**: BizBridge Category Guarantee
**Payment Terms**: To be arranged directly between parties

### TIMELINE
**Estimated Duration**: ${agreement.agreedTerms.duration}
**Scheduled Start**: ${scheduledDate.startDate.toLocaleDateString('en-NG')}
${scheduledDate.startTime ? `**Start Time**: ${scheduledDate.startTime}` : ''}
${scheduledDate.endDate ? `**Expected Completion**: ${scheduledDate.endDate.toLocaleDateString('en-NG')}` : ''}

### LOCATION & LOGISTICS
**Service Location**: ${agreement.agreedTerms.meetingLocation}
**Logistics**: As mutually agreed between parties

---

## CATEGORY-SPECIFIC TERMS

### SELECTED CATEGORY SPECIFICATIONS
**Category**: ${agreement.agreedTerms.selectedCategory}
**Category Standards**: Service must meet the specifications and quality standards typical for this category
**Scope Alignment**: Service delivered must align with the selected category description

### BIZBRIDGE CATEGORY GUARANTEE
As this is a categorized pricing service, BizBridge provides enhanced protection:

#### PRICE PROTECTION
- The price for this category is fixed and protected by BizBridge
- Artisan cannot charge more than the agreed category price
- Customer is protected from price increases for this category

#### QUALITY STANDARDS
- Service must match the selected category specifications
- Quality must meet reasonable standards for this category type
- Deviations from category standards are grounds for dispute

#### DISPUTE RESOLUTION SUPPORT
- BizBridge will mediate disagreements about category specifications
- BizBridge will provide resolution support for quality issues
- This is the only pricing structure where BizBridge provides active dispute mediation

---

## SPECIAL TERMS & CONDITIONS

${agreement.agreedTerms.specialTerms ? `
### ADDITIONAL TERMS
${agreement.agreedTerms.specialTerms}
` : '### ADDITIONAL TERMS\nNo additional terms specified.'}

### CATEGORY COMPLIANCE REQUIREMENTS
- Service must be delivered according to selected category standards
- Any deviation from category scope requires customer agreement
- Category changes require new contract with updated pricing
- Quality standards are enforced by BizBridge mediation

---

${COMMON_TERMS.bizBridgeDisclaimer}

### ENHANCED DISPUTE RESOLUTION FOR CATEGORIZED SERVICES

In addition to general dispute resolution, categorized services include:

#### BIZBRIDGE MEDIATION
- BizBridge will actively mediate category-related disputes
- Quality assessments available for category compliance
- Resolution timeline: 5-7 business days for category disputes
- Final decisions are binding for category-related issues

#### CATEGORY DISPUTE GROUNDS
- Service doesn't match selected category
- Quality below category standards
- Scope significantly different from category description
- Price charged exceeds agreed category price

---

${COMMON_TERMS.legalFramework}

---

## AGREEMENT ACCEPTANCE

By digitally accepting this contract on the BizBridge platform, both parties acknowledge:
1. They understand the selected category and its requirements
2. They agree to BizBridge mediation for category-related disputes
3. They understand the enhanced protections for categorized services
4. They will handle all financial transactions directly

### DIGITAL SIGNATURES
**Customer**: ${customer.fullName || customer.name}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.customer ? 
  new Date(agreement.contractAccepted.timestamps.customer).toLocaleString('en-NG') : 'Pending'}

**Artisan**: ${artisan.contactName || artisan.businessName}
**Acceptance Date**: ${agreement.contractAccepted.timestamps.artisan ? 
  new Date(agreement.contractAccepted.timestamps.artisan).toLocaleString('en-NG') : 'Pending'}

---

*This contract was generated by BizBridge Nigeria and includes enhanced protections for categorized services.*
`;
};

// ========== SIMPLIFIED PDF GENERATION (WITHOUT PDFKIT) ==========
// Note: For full PDF generation, install pdfkit: npm install pdfkit

export const generateContractPDF = async (contractText, booking) => {
  try {
    // For now, we'll create a text file instead of PDF
    // To enable PDF generation, install pdfkit and uncomment the PDF code below
    
    const filename = `contract_${booking._id}_${Date.now()}.txt`;
    const contractsDir = path.join('uploads', 'contracts');
    
    // Ensure directory exists
    try {
      if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
      }
    } catch (e) {
      console.warn('Could not create contracts directory:', e.message);
    }
    
    const filepath = path.join(contractsDir, filename);
    
    // Write contract text to file
    fs.writeFileSync(filepath, contractText, 'utf8');

    return {
      filepath,
      filename,
      url: `/uploads/contracts/${filename}`
    };

  } catch (error) {
    console.error('Error generating contract file:', error);
    throw new Error('Failed to generate contract file');
  }
};

// ========== ENHANCED CONTRACT MANAGER ==========

export const generateEnhancedContract = async (booking, service) => {
  let contractText;

  // Generate appropriate contract based on service pricing type
  switch (service.pricing?.type) {
    case 'fixed':
      contractText = generateFixedPricingContract(booking, service);
      break;
    case 'negotiate':
      contractText = generateNegotiatePricingContract(booking, service);
      break;
    case 'categorized':
      contractText = generateCategorizedPricingContract(booking, service);
      break;
    default:
      contractText = generateNegotiatePricingContract(booking, service); // Fallback
  }

  // Store contract text in booking
  booking.agreement.contractText = contractText;
  booking.agreement.contractVersion = CONTRACT_VERSION;
  booking.agreement.generatedAt = new Date();

  // Generate file version (text for now, PDF when pdfkit is installed)
  try {
    const fileInfo = await generateContractPDF(contractText, booking);
    booking.agreement.contractPDF = fileInfo;
  } catch (error) {
    console.error('Contract file generation failed, continuing with text contract:', error);
  }

  await booking.save();

  return {
    text: contractText,
    version: CONTRACT_VERSION,
    pdfUrl: booking.agreement.contractPDF?.url || null
  };
};

// ========== CONTRACT VALIDATION ==========

export const validateContractAcceptance = (booking) => {
  const { agreement } = booking;
  
  return {
    contractExists: !!agreement.contractText,
    customerAccepted: agreement.contractAccepted.customer,
    artisanAccepted: agreement.contractAccepted.artisan,
    bothAccepted: agreement.bothPartiesAccepted,
    contractVersion: agreement.contractVersion,
    canProceed: agreement.bothPartiesAccepted,
    nextAction: !agreement.contractAccepted.customer ? 'customer_acceptance' :
                !agreement.contractAccepted.artisan ? 'artisan_acceptance' : 'proceed'
  };
};

// ========== EXPORT FUNCTIONS ==========

export default {
  generateEnhancedContract,
  generateContractPDF,
  validateContractAcceptance,
  generateFixedPricingContract,
  generateNegotiatePricingContract,
  generateCategorizedPricingContract
};