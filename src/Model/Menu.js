const FileDetails = require('./FileDetails');

module.exports = [
    {
        header: 'Site Lighthouse',
        content: 'Generates lighthouse reports for a domain.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'domain',
                type: String,
                typeLabel: '[underline]{www.domain.com}',
                description: '(Required) Domain to run the reports on.'
            },
            {
                name: 'output',
                type: filename => new FileDetails(filename),
                typeLabel: '[underline]{file}',
                description: '(Required) Folder to output the reports to.'
            },
            {
                name: 'verbose',
                defaultValue: false,
                type: Boolean,
                description: 'Output information on the reporting.'
            },
            {
                name: 'help',
                type: Boolean,
                description: 'Print this usage guide.'
            }
        ]
    }
];