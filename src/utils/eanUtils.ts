
/**
 * Utility functions for EAN code lookup and validation
 */

// In a real implementation, this would call an actual API
export const lookupEanCode = async (ean: string): Promise<EanCodeInfo | null> => {
  try {
    console.log(`Looking up EAN code: ${ean}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple validation for EAN format
    const validation = validateEanCode(ean);
    if (!validation.isValid) {
      console.log("Invalid EAN format:", validation.message);
      return null;
    }
    
    // Check if this is a test code, to always return data for demo purposes
    // In a real implementation, this would be removed
    const isTestCode = ean.startsWith("871234567");
    
    if (isTestCode) {
      return {
        ean: ean,
        address: "Voorbeeldstraat 123",
        city: "Amsterdam",
        postalCode: "1234 AB",
        gridOperator: "Liander",
        connectionType: "Elektriciteit",
        capacity: "3x25A"
      };
    }
    
    // For demonstration, we'll return data for certain country codes
    // In a real implementation, this would query an actual API
    const countryCode = ean.substring(0, 2);
    
    // Dutch energy codes start with 87
    if (countryCode === "87") {
      return {
        ean: ean,
        address: "Energieweg 42",
        city: "Utrecht",
        postalCode: "3542 DL",
        gridOperator: "Stedin",
        connectionType: "Elektriciteit",
        capacity: "3x25A"
      };
    }
    
    // Belgian energy codes often start with 54
    if (countryCode === "54") {
      return {
        ean: ean,
        address: "Rue de l'Énergie 15",
        city: "Brussel",
        postalCode: "1000",
        gridOperator: "Fluvius",
        connectionType: "Elektriciteit",
        capacity: "3x25A"
      };
    }
    
    // If not found, return null to indicate no data available
    return null;
  } catch (error) {
    console.error("Error looking up EAN code:", error);
    return null;
  }
};

// Enhanced validation for EAN codes - now with more lenient Dutch code acceptance
export const validateEanCode = (ean: string): EanValidationResult => {
  // Basic format check - must be digits only
  if (!/^\d*$/.test(ean)) {
    return { 
      isValid: false, 
      message: "EAN code mag alleen cijfers bevatten" 
    };
  }
  
  // Length check
  if (ean.length !== 18) {
    return { 
      isValid: false, 
      message: `EAN code moet exact 18 cijfers bevatten (nu: ${ean.length})` 
    };
  }
  
  // Auto-accept Dutch energy codes (start with 87) 
  // as per the new requirement
  const countryCode = ean.substring(0, 2);
  if (countryCode === "87") {
    return { 
      isValid: true, 
      message: "EAN code is geldig" 
    };
  }
  
  // For non-Dutch codes, use more strict validation
  if (countryCode !== "54") {
    return { 
      isValid: false, 
      message: "EAN code lijkt ongeldig. Nederlandse codes beginnen meestal met '87'" 
    };
  }
  
  // For Belgian codes (54), still perform check digit validation
  // Sum of even-positioned digits multiplied by 3, plus sum of odd-positioned digits
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const digit = parseInt(ean[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(ean[17], 10);
  
  if (checkDigit !== lastDigit) {
    return { 
      isValid: false, 
      message: "EAN code heeft een ongeldig controlecijfer" 
    };
  }
  
  // If all checks pass, EAN is valid
  return { isValid: true, message: "EAN code is geldig" };
};

// TypeScript interfaces
export interface EanCodeInfo {
  ean: string;
  address: string;
  city: string;
  postalCode: string;
  gridOperator: string;
  connectionType: string;
  capacity: string;
}

export interface EanValidationResult {
  isValid: boolean;
  message: string;
}
