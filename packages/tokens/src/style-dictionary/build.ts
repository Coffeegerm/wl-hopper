import StyleDictionary from "style-dictionary";

import { fontsConfig, getStyleDictionaryConfig, getStyledSystemTokensConfig, styledSystemTokenMappingConfig } from "./config.ts";
import { isColorType } from "./filter/isColorType.ts";
import { isDarkTokens } from "./filter/isDarkTokens.ts";
import { customTsTokenMapping } from "./format/custom-ts-token-mapping.ts";
import { cssDarkMode, customDoc, customJson, customTsTokens, fontFace } from "./format/index.ts";
import { w3cTokenJsonParser } from "./parser/w3c-token-parser.ts";
import { attributeFont, isSizeType, pxToRem } from "./transform/index.ts";

const { fileHeader } = StyleDictionary.formatHelpers;

// Filters
StyleDictionary.registerFilter({
    name: "mode/dark",
    matcher: isDarkTokens
});

StyleDictionary.registerFilter({
    name: "colors",
    matcher: isColorType
});

// Transform
StyleDictionary.registerTransform({
    name: "pxToRem",
    type: "value",
    matcher: isSizeType,
    transformer: pxToRem
});

StyleDictionary.registerTransform({
    name: "attribute/font",
    type: "attribute",
    transformer: attributeFont
});

StyleDictionary.registerTransformGroup({
    name: "custom/css",
    transforms: StyleDictionary.transformGroup["css"].concat(["pxToRem"])
});

// Format
StyleDictionary.registerFormat({
    name: "font-face",
    formatter: fontFace
});

StyleDictionary.registerFormat({
    name: "css/dark-mode",
    formatter: cssDarkMode
});

StyleDictionary.registerFormat({
    name: "custom/doc",
    formatter: customDoc
});

StyleDictionary.registerFormat({
    name: "custom/json",
    formatter: customJson
});

StyleDictionary.registerFormat({
    name: "custom/ts-tokens",
    formatter: ({ dictionary, file }) => {
        return fileHeader({ file }) + customTsTokens({ dictionary });
    }
});

StyleDictionary.registerFormat({
    name: "custom/ts-token-mapping",
    formatter: ({ dictionary, file }) => {
        return fileHeader({ file }) + customTsTokenMapping({ dictionary });
    }
});

// File Headers
StyleDictionary.registerFileHeader({
    name: "typescript-file-header",
    fileHeader: () => {
        return [
            "This file is generated by Style Dictionary. Do not edit directly."
        ];
    }
});

// Parser
StyleDictionary.registerParser(w3cTokenJsonParser);

// Build
console.log("\nBuild started...");

console.log("\n|- 🔤 Building fonts...");
StyleDictionary.extend(fontsConfig).buildAllPlatforms();

console.log("\n|- 🌞️ Default tokens...");
StyleDictionary.extend(getStyleDictionaryConfig("light")).buildAllPlatforms();

console.log("\n|- 🌙 Building dark mode...");
StyleDictionary.extend(getStyleDictionaryConfig("dark")).buildAllPlatforms();

console.log("\n|- 💅 Building Styled System tokens... (1/3)");
StyleDictionary.extend(getStyledSystemTokensConfig("light")).buildAllPlatforms();

console.log("\n|- 💅 Building Styled System dark tokens... (2/3)");
StyleDictionary.extend(getStyledSystemTokensConfig("dark")).buildAllPlatforms();

console.log("\n|- 💅 Building Styled System token mappings... (3/3)");
StyleDictionary.extend(styledSystemTokenMappingConfig).buildAllPlatforms();

console.log("\n🚀 Build completed!\n");
