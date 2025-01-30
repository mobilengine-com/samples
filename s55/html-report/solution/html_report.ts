// ------------------------------------------------------------------------------------------------
// Code to build the report HTML from the report input.
// ------------------------------------------------------------------------------------------------

import { html } from './html_templating'
import { libreBaskervilleFont } from './resources'

export interface Photo {
    mediaId: string,
    description: string
}

export interface ReportInput {
    title: string
    intro: string
    photos: Photo[]
}

const htmlFromPhoto = (photo: Photo) => html`
    <table class=photo>
        <td><img src=/media/${photo.mediaId}></td>
        <td class=description>${photo.description}</td>
    </table>
`

export const generateReport = (input: ReportInput) => html`
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                @font-face {
                    font-family: "LibreBaskervilleRegular";
                    src: url(${libreBaskervilleFont});
                }

                body {
                    font-family: LibreBaskervilleRegular, Wingdings;
                }

                @page {
                    size: A4;
                    margin: 2cm;
                }

                .photo {
                    margin-bottom: 1cm;

                    img {
                        width: 6cm;
                        height: 6cm;
                        object-fit: contain;
                    }

                    .description {
                        padding-left: 1cm;
                        text-align: justify;
                    }
                }
            </style>
        </head>
        <body>
            <h1>${input.title}</h1>
            <p>${input.intro}</p>
            ${input.photos.map(htmlFromPhoto)}
        </body>
    </html>
`