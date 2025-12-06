# PureLabel - Ingredient Decoder 🥗🔍

PureLabel is an intelligent food analysis assistant powered by **Google Gemini AI**. It helps users instantly decode complex product labels, verify vegan suitability, identify specific allergens (including custom user-defined ones), and understand technical chemical additives in simple terms.

![PureLabel App Screenshot](https://via.placeholder.com/800x450?text=PureLabel+App+Preview)

## 🚀 Features

- **Vegan Verification**: Instantly checks if a product is plant-based or contains hidden animal derivatives.
- **Smart Allergen Detection**: 
  - Automatically detects common allergens (Peanuts, Gluten, Dairy, Soy, etc.).
  - **Custom Sensitivity Support**: Users can input specific allergies (e.g., "Strawberries", "Mushrooms") for personalized checks.
- **Ingredient De-Jargonizer**: Identifies chemical numbers (e-numbers) and complex technical terms, explaining them in simple language with safety ratings (Safe/Caution/Avoid).
- **Dual Input Modes**:
  - **Text Mode**: Paste ingredient lists directly.
  - **Visual Scan**: Upload photos of product labels (powered by Gemini Vision).
- **Dark Mode UI**: A modern, high-contrast dark interface designed for readability.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash (via `@google/genai` SDK)
- **Icons**: Lucide React

## ⚙️ Configuration

To run this project, you need a Google Gemini API Key.

1. **Get an API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/).
   - Create an API Key.

2. **Environment Variable**:
   - The application expects the API Key to be available via `process.env.API_KEY`.
   - Ensure your build environment or `.env` file is configured correctly.

## 📦 Usage

1. **Analyze Text**: Copy ingredients from a website or label and paste them into the text area.
2. **Analyze Image**: Click "Scan Label" to upload a clear photo of a product's ingredient section.
3. **Custom Allergies**: If you are allergic to specific uncommon items (e.g., Garlic, Kiwi), type them into the "Custom Allergies" input field before analyzing.

## ⚠️ Disclaimer

This application relies on Artificial Intelligence to analyze text and images. While it is designed to be helpful, **it is not a substitute for medical advice or manual verification**. Always read the physical product label yourself, especially if you have severe life-threatening allergies.

#


<img width="1268" height="525" alt="Screenshot 2025-12-06 174730" src="https://github.com/user-attachments/assets/85d8f019-2b5d-4e4c-b03d-4decbafdfd1b" />

