# Media Manager Tutorial

[![](https://img.shields.io/badge/playground-live%20preview-blue?logo=wordpress)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/juanma-wp/media-manager-tutorial/refs/heads/main/_playground/blueprint.json)

A WordPress plugin that demonstrates how to build a custom media management interface using the WordPress DataViews and DataForm components. This plugin provides an enhanced media library experience with advanced sorting, filtering, and editing capabilities.

## Features

- **DataViews Integration**: Display media items in a customizable table or grid view
- **Advanced Filtering**: Search and filter media by various attributes (caption, file type, date, etc.)
- **Inline Editing**: Edit media properties directly from the list view
- **Modal Editing**: Comprehensive media editing in a modal dialog
- **Sorting Options**: Sort media by date, file size, title, and other metadata
- **Responsive Layout**: Supports both table and grid view layouts
- **Bulk Actions**: Perform actions on multiple media items at once

## Requirements

- WordPress 6.5 or higher
- PHP 8.0 or higher
- Node.js 18+ and npm for development

## Installation

### From Source

1. Clone the repository to your WordPress plugins directory:
```bash
cd wp-content/plugins
git clone https://github.com/juanma-wp/media-manager-tutorial.git
cd media-manager-tutorial
```

2. Install dependencies:
```bash
npm install
```

3. Build the plugin:
```bash
npm run build
```

4. Activate the plugin in WordPress Admin

### Using WordPress Playground

The plugin includes a blueprint configuration for easy testing with WordPress Playground:

1. Visit [WordPress Playground](https://playground.wordpress.net/)
2. Load the blueprint from `_playground/blueprint.json`
3. The plugin will be automatically installed and activated

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development build with watch mode
npm start

# Create production build
npm run build
```

### Project Structure

```
media-manager-tutorial/
├── src/
│   ├── index.js           # Main entry point
│   ├── ViewMediaList.js   # Main media list component with DataViews
│   ├── EditMedia.js       # Inline media editing component
│   ├── MediaEditModal.js  # Modal editing interface
│   ├── fields.js          # Field definitions for DataViews/DataForm
│   ├── actions.js         # Action definitions for media items
│   └── style.scss         # Component styles
├── build/                 # Compiled assets (generated)
├── _playground/           # WordPress Playground configuration
├── plugin.php            # Main plugin file
└── package.json          # Node dependencies and scripts
```

## Usage

After activation, navigate to **Media → Media Manager** in the WordPress admin menu to access the enhanced media management interface.

### Features Overview

1. **View Modes**: Switch between table and grid layouts
2. **Search**: Real-time search across media titles and captions
3. **Filters**: Filter by file type, date range, and other attributes
4. **Edit**: Click the edit action to modify media properties
5. **Sorting**: Click column headers to sort by different fields
6. **Pagination**: Navigate through large media libraries efficiently

## Key Components

### DataViews
The plugin leverages WordPress DataViews component to provide:
- Flexible data display with table and grid layouts
- Built-in sorting, filtering, and search capabilities
- Customizable field visibility and ordering

### DataForm
Used for the media editing interface, providing:
- Dynamic form generation based on field definitions
- Validation and error handling
- Seamless integration with WordPress data stores

## Development Notes

### Technologies Used
- **WordPress Scripts**: Build tooling and webpack configuration
- **@wordpress/dataviews**: Data display component
- **@wordpress/core-data**: WordPress data layer integration
- **@wordpress/element**: React wrapper for WordPress
- **@wordpress/i18n**: Internationalization support

### API Integration
The plugin uses WordPress REST API for all media operations:
- Fetching media items via `wp/v2/media` endpoint
- Updating media metadata
- Managing attachments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL v2 or later.

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/juanma-wp/media-manager-tutorial/issues).

## Acknowledgments

Built as a tutorial project to demonstrate the capabilities of WordPress DataViews and DataForm components in creating modern admin interfaces.