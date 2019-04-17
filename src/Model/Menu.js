// @flow
import FileDetails from "./FileDetails";

const getFileDetails = (filename: string): FileDetails => {
    return new FileDetails(filename);
};

export default [
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
                type: getFileDetails,
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