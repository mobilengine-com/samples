//# server typescript program generate_report for form report_form
//# using reftab reports;

// ------------------------------------------------------------------------------------------------
// This file contains the input data for the report, and the code to start the report generation.
// ------------------------------------------------------------------------------------------------

import { generateReport } from "./html_report";

const reportHtml = generateReport({
    title: 'HTML Report',
    intro: 'This is a sample report generated from HTML.',
    photos: [
        {
            mediaId: '66f41df6efd3430d93da8664931c8a50_photo.jpg',
            description: `
                This photo showcases the iconic Marina Bay area in Singapore at night. The image features the following key landmarks:
                Marina Bay Sands: The distinctive building with three towers connected by a skypark at the top, brightly illuminated with its interior lights visible through the glass facade.
                Helix Bridge: A striking pedestrian bridge with a double-helix structure, lit with vibrant red and white lights, creating a captivating reflection in the water.
                ArtScience Museum: The unique lotus-shaped building to the right of the bridge, also illuminated, adding an artistic flair to the scene.
                City Skyline: Modern skyscrapers in the background, lit with colorful lights, highlighting Singapore's urban sophistication.
                Water Reflections: The calm water of Marina Bay mirrors the lights from the buildings and structures, enhancing the overall beauty of the composition.
                This nighttime shot emphasizes the modern architectural marvels and vibrant energy of Singapore.
            `
        },
        {
            mediaId: '8eb0060a85f04044b9c8598915ca4ee8_portrait.jpg',
            description: `
                This photo features a tall, modern skyscraper with a sleek and minimalist design. Key details include:
                Facade: The building is primarily composed of glass panels, giving it a reflective, futuristic appearance.
                Shape: It has a distinctive tapering form, narrowing slightly toward the top. Portions of the structure on the upper sides appear unfinished or under construction, revealing the steel framework.
                Sky: The background is a pale, overcast sky, emphasizing the structure's clean and geometric lines without distractions.
                Architectural Style: The overall style leans toward contemporary design, with a focus on verticality and transparency.
                This image highlights the structural elegance and innovation often associated with modern skyscrapers.
            `
        },
        {
            mediaId: 'dc6435438ca7488f810ca2577cd7c3f3_landscape.jpg',
            description: `
                This photo depicts a stunning desert landscape, characterized by its dramatic natural rock formations and warm, golden lighting. Key features include:
                Rock Formations: The image highlights rugged, weathered rock structures scattered across the desert terrain, adding texture and depth to the scene.
                Sand Patterns: Smooth dunes and wind-sculpted sand create graceful curves, contrasting with the solidity of the rocks.
                Lighting: The low angle of the sunlight bathes the scene in a golden glow, casting long shadows that accentuate the contours of the landscape.
                Horizon and Haze: A faint atmospheric haze in the distance softens the transition between the land and the pale blue sky, creating a sense of vastness and tranquility.
                Isolated Pools: Small patches of water or reflective surfaces are visible, adding an unexpected element of contrast in the arid environment.
                This image captures the serene and timeless beauty of desert wilderness.
            `
        }
    ]
})

// run this file with `deno --unstable-sloppy-imports generate_report.ts >output.html` to get the html
if (globalThis.Log === undefined) {
    globalThis.console.log(reportHtml.value);
} else {
    let reportDocument = pdf.PrintHtml(reportHtml)
    let reportId = reportDocument.Store('report.pdf')
    Log(`Report saved with id ${reportId}`)
    db.reports.Insert({ id: reportId, date: dtl.Now().DtlToDtdb() })
}