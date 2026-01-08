import { useParams, Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

interface LearnContent {
    title: string;
    readTime: string;
    content: React.ReactNode;
}

const learnContent: Record<string, LearnContent> = {
    "3d-printing-basics": {
        title: "3D Printing Basics",
        readTime: "10 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    3D printing turns digital files into physical objects by building them layer by layer.
                    That's the simple version. Here's what you actually need to understand.
                </p>

                <h3>What 3D Printing Actually Is</h3>
                <p>
                    Unlike traditional manufacturing, which often removes material (cutting, drilling, milling),
                    3D printing adds material. A printer deposits or solidifies material in thin layers,
                    stacking them until the object is complete. This approach is called "additive manufacturing."
                </p>
                <p>
                    The most common consumer technology is FDM (Fused Deposition Modeling): plastic filament
                    is melted and extruded through a nozzle that moves in precise patterns. Think of it like
                    a very precise hot glue gun on a robotic arm.
                </p>

                <h3>The Basic Process</h3>
                <ol>
                    <li><strong>Start with a digital design:</strong> Either create your own 3D model or find one online (STL files are the common format)</li>
                    <li><strong>Slice the model:</strong> Software called a "slicer" converts the 3D shape into layer-by-layer instructions</li>
                    <li><strong>Send to printer:</strong> The slicer outputs a file (G-code) that tells the printer exactly where to move</li>
                    <li><strong>Print:</strong> The printer builds the object layer by layer over minutes to hours</li>
                    <li><strong>Post-process:</strong> Remove from bed, take off supports, clean up if needed</li>
                </ol>

                <h3>What 3D Printing Is Good For</h3>
                <ul>
                    <li><strong>Custom one-off parts:</strong> Replacement components, unique solutions, specific dimensions</li>
                    <li><strong>Prototyping:</strong> Test ideas quickly before committing to expensive manufacturing</li>
                    <li><strong>Complex geometries:</strong> Shapes that would be impossible to mold or machine</li>
                    <li><strong>Small batches:</strong> When you need 10 of something, not 10,000</li>
                    <li><strong>Personalization:</strong> Each print can be slightly different at no additional cost</li>
                </ul>

                <h3>What 3D Printing Is Not Good For</h3>
                <ul>
                    <li><strong>Mass production:</strong> Injection molding is faster and cheaper at high volumes</li>
                    <li><strong>Perfect surfaces:</strong> Layer lines are visible on FDM prints unless post-processed</li>
                    <li><strong>All materials:</strong> Consumer printers work with specific plastics; metal, glass, and other materials require industrial equipment</li>
                    <li><strong>Instant results:</strong> A single print can take hours or overnight</li>
                </ul>

                <h3>Types of 3D Printing</h3>
                <p>
                    <strong>FDM (Fused Deposition Modeling):</strong> The most common. Uses plastic filament.
                    Affordable, accessible, but visible layer lines. Great for functional parts.
                </p>
                <p>
                    <strong>SLA/MSLA (Resin):</strong> Uses liquid resin cured by UV light. Much finer detail,
                    smooth surfaces. Great for models, jewelry, detailed figurines. Requires more post-processing.
                </p>
                <p>
                    <strong>SLS (Selective Laser Sintering):</strong> Industrial process using powdered material
                    and lasers. Very strong parts, no supports needed. Typically only available through services.
                </p>

                <h3>Common Materials</h3>
                <p>
                    <strong>PLA:</strong> The default material. Made from corn starch, easy to print,
                    biodegradable in industrial conditions. Good for most non-mechanical parts.
                </p>
                <p>
                    <strong>PETG:</strong> Stronger and more heat-resistant than PLA. Good for functional parts
                    that need durability. Slightly harder to print well.
                </p>
                <p>
                    <strong>ABS:</strong> Classic engineering plastic. Strong, heat-resistant, but needs
                    an enclosure and good ventilation. Used for parts that take abuse.
                </p>
                <p>
                    <strong>TPU:</strong> Flexible material for things like phone cases, gaskets, wheels.
                    Requires adjusted settings and patience.
                </p>

                <h3>Setting Realistic Expectations</h3>
                <p>
                    A 3D printer is a tool, not magic. It requires learning, tuning, and maintenance.
                    Prints fail. Settings need adjusting. Initial investments add up (printer, filament,
                    tools, modifications).
                </p>
                <p>
                    For occasional use, a print service often makes more sense than owning. For regular use
                    and the desire to learn, owning opens up possibilities.
                </p>
                <p>
                    The technology is genuinely transformative — but it works best when you understand
                    what it can and can't do.
                </p>
            </>
        )
    },
    "licensing-explained": {
        title: "Licensing Explained",
        readTime: "12 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    Every 3D model file comes with rights attached. Understanding those rights is the difference
                    between legal use and infringement. Here's what you need to know.
                </p>

                <h3>What a License Actually Does</h3>
                <p>
                    When someone creates a 3D model, they automatically own the copyright. A license is
                    permission from that owner to use their creation under specific conditions.
                </p>
                <p>
                    The owner doesn't give up ownership — they just grant you limited rights to do
                    certain things with their work. What rights you get depends entirely on the license terms.
                </p>

                <h3>Personal Use</h3>
                <p>
                    "Personal use" typically means you can:
                </p>
                <ul>
                    <li>Download and store the file</li>
                    <li>Print it for yourself</li>
                    <li>Give the printed object as a gift</li>
                </ul>
                <p>
                    Personal use typically does NOT include:
                </p>
                <ul>
                    <li>Selling prints</li>
                    <li>Using prints in a commercial product</li>
                    <li>Redistributing the file itself</li>
                </ul>

                <h3>Commercial Use</h3>
                <p>
                    Commercial licenses allow you to make money from the work. Depending on the specific terms:
                </p>
                <ul>
                    <li>Sell unlimited prints</li>
                    <li>Use in products you manufacture</li>
                    <li>Sometimes modify the design</li>
                    <li>Sometimes sublicense to others</li>
                </ul>
                <p>
                    Commercial licenses typically cost money — anywhere from a few dollars to hundreds
                    depending on the design's complexity and the rights granted.
                </p>

                <h3>Creative Commons Licenses</h3>
                <p>
                    Many 3D models use Creative Commons (CC) licenses. Here's what the common types mean:
                </p>
                <ul>
                    <li><strong>CC0 (Public Domain):</strong> No restrictions. Do anything you want. No attribution required.</li>
                    <li><strong>CC BY (Attribution):</strong> Use freely, but credit the creator.</li>
                    <li><strong>CC BY-NC (Non-Commercial):</strong> Use freely but no commercial use. Credit required.</li>
                    <li><strong>CC BY-SA (ShareAlike):</strong> Modifications must be shared under the same license.</li>
                    <li><strong>CC BY-NC-SA:</strong> Non-commercial, attribution, and ShareAlike combined.</li>
                </ul>
                <p>
                    The key restriction is "NC" — NonCommercial. If you see NC, you cannot sell prints
                    without separate permission from the creator.
                </p>

                <h3>What About Modifications?</h3>
                <p>
                    Creating a "remix" or modification of someone's design doesn't automatically grant you
                    more rights. If the original was non-commercial, your modification is too.
                </p>
                <p>
                    The only way to gain commercial rights to a derivative work is:
                </p>
                <ul>
                    <li>The original had a CC0 or commercial license</li>
                    <li>You get explicit permission from the original creator</li>
                    <li>Your modifications are so substantial that it's legally a new work (a very high bar)</li>
                </ul>

                <h3>Trademark and Brand Issues</h3>
                <p>
                    Even if a file is technically "legal" to print, printing branded items (logos,
                    copyrighted characters, trademarked designs) can still be infringement.
                </p>
                <p>
                    A file that recreates a popular franchise character might be hosted on Thingiverse,
                    but that doesn't mean you can sell prints of it. The file uploader doesn't have
                    authority to grant rights they don't hold.
                </p>

                <h3>When In Doubt</h3>
                <ul>
                    <li>Look for the license on the download page</li>
                    <li>Read the full license terms if linked</li>
                    <li>Contact the designer and ask directly</li>
                    <li>If you can't find clear permission, assume you don't have it</li>
                </ul>
                <p>
                    Most designers are approachable. A simple email asking about commercial rights
                    often leads to reasonable licensing arrangements.
                </p>

                <h3>Why This Matters</h3>
                <p>
                    Respecting licenses keeps the ecosystem healthy. When designers see their work being
                    sold without compensation, they stop sharing. The community loses creators.
                    Everyone ends up with fewer good designs to work with.
                </p>
                <p>
                    Playing fair starts with understanding the rules.
                </p>
            </>
        )
    },
    "choosing-your-first-printer": {
        title: "Choosing Your First Printer",
        readTime: "15 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    Buying a 3D printer can feel overwhelming. There are dozens of options, endless
                    YouTube reviews, and passionate opinions everywhere. Here's a no-nonsense guide
                    to what actually matters.
                </p>

                <h3>The Honest Question: Should You Buy One?</h3>
                <p>
                    Before picking a model, ask if you should buy at all. 3D printing is a hobby as
                    much as a tool. Printers need maintenance, calibration, and troubleshooting.
                    There's a learning curve.
                </p>
                <p>
                    If you want to print something once a month and don't enjoy tinkering, a print
                    service is probably better. If you want to experiment, iterate, and learn —
                    ownership makes sense.
                </p>

                <h3>FDM vs Resin: Pick Your Path</h3>
                <p>
                    <strong>FDM (Filament):</strong> Easier to use, less messy, lower operating costs.
                    Visible layer lines but great for functional parts. Most beginners start here.
                </p>
                <p>
                    <strong>Resin:</strong> Incredible detail, smooth surfaces. But messy, requires
                    post-curing, uses chemicals that need careful handling. Great for miniatures,
                    jewelry, figurines.
                </p>
                <p>
                    Choose based on what you want to make, not what seems more advanced.
                </p>

                <h3>What Actually Matters in an FDM Printer</h3>
                <p><strong>Build Volume:</strong> How big can your prints be? Most people don't need
                    huge build volumes. 220x220x250mm covers most projects. Bigger = more expensive
                    and harder to heat evenly.</p>
                <p><strong>Bed Leveling:</strong> Automatic bed leveling reduces frustration significantly.
                    Manual leveling works but requires learning and patience. Modern printers often
                    include auto-leveling — prioritize this feature.</p>
                <p><strong>Direct Drive vs Bowden:</strong> Direct drive extruders handle flexible
                    filaments better. Bowden setups are lighter and can print faster. For beginners,
                    either works for standard materials.</p>
                <p><strong>Print Speed:</strong> Faster isn't always better. Speed affects quality.
                    Modern printers claim high speeds, but real-world use often runs slower for
                    better results.</p>
                <p><strong>Enclosure:</strong> An enclosed printer handles ABS and other temperature-
                    sensitive materials better. Not essential for PLA/PETG, but nice to have.</p>

                <h3>Budget Tiers (2026 Canadian Prices)</h3>
                <p><strong>Entry Level ($200-400):</strong> Capable machines that require more setup and
                    tuning. Great for learning. Expect some assembly and calibration.</p>
                <p><strong>Mid-Range ($400-800):</strong> Better out-of-box experience, more reliable,
                    auto-leveling often included. The sweet spot for most beginners.</p>
                <p><strong>Premium ($800+):</strong> Enclosed, fully featured, minimal setup. Fast,
                    quiet, consistent. Great if you value time over tinkering.</p>
                <p>
                    There's no single "best" printer. What matters is matching features to your needs
                    and budget.
                </p>

                <h3>Red Flags to Avoid</h3>
                <ul>
                    <li>Extremely cheap machines with no community or support</li>
                    <li>Proprietary filament requirements (avoid vendor lock-in)</li>
                    <li>No active community or forums for troubleshooting</li>
                    <li>Minimal documentation or customer service</li>
                </ul>

                <h3>What Else You'll Need</h3>
                <p>The printer isn't the only cost:</p>
                <ul>
                    <li><strong>Filament:</strong> $25-40 per spool for quality PLA/PETG</li>
                    <li><strong>Tools:</strong> Scrapers, pliers, cleaning supplies, Allen keys</li>
                    <li><strong>Spare parts:</strong> Nozzles wear out, belts stretch, things break</li>
                    <li><strong>Enclosure (optional):</strong> DIY or purchased, for temperature control</li>
                    <li><strong>Software:</strong> Slicers are usually free (PrusaSlicer, Cura, Bambu Studio)</li>
                </ul>

                <h3>The Learning Curve</h3>
                <p>
                    Expect your first month to involve some failed prints, confusion about settings,
                    and time spent reading forums. This is normal. Every experienced maker went through
                    the same thing.
                </p>
                <p>
                    The good news: most problems are solvable, communities are helpful, and the
                    learning compounds. What seems confusing in week one becomes intuitive by month three.
                </p>

                <h3>Final Recommendation</h3>
                <p>
                    Pick a printer with an active community. When things go wrong — and they will —
                    you want forums, Discord servers, and YouTube tutorials specific to your machine.
                    Community support often matters more than specs.
                </p>
            </>
        )
    },
    "materials-guide": {
        title: "Materials Guide",
        readTime: "14 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    Different materials have different properties. Choosing the right one determines
                    whether your print succeeds or fails at its intended purpose.
                </p>

                <h3>PLA (Polylactic Acid)</h3>
                <p>
                    <strong>What it is:</strong> A bioplastic derived from corn starch or sugarcane.
                    The most common filament for beginners and general use.
                </p>
                <p><strong>Pros:</strong></p>
                <ul>
                    <li>Easy to print — forgiving of settings mistakes</li>
                    <li>Low warping — sticks to the bed well</li>
                    <li>Low odor during printing</li>
                    <li>Wide color range and variants (matte, silk, wood-fill)</li>
                    <li>Affordable ($20-35/kg)</li>
                </ul>
                <p><strong>Cons:</strong></p>
                <ul>
                    <li>Low heat resistance — softens around 50-60°C</li>
                    <li>Brittle under impact — can crack or shatter</li>
                    <li>Limited outdoor durability (UV degrades it)</li>
                </ul>
                <p><strong>Best for:</strong> Decorative items, prototypes, indoor parts, low-stress applications.</p>
                <p><strong>Avoid for:</strong> Car interiors (heat), mechanical parts under stress, outdoor use.</p>

                <h3>PETG (Polyethylene Terephthalate Glycol)</h3>
                <p>
                    <strong>What it is:</strong> A tougher, more heat-resistant plastic similar to
                    water bottles but modified for printing.
                </p>
                <p><strong>Pros:</strong></p>
                <ul>
                    <li>Much stronger and more flexible than PLA</li>
                    <li>Higher heat resistance (~70-80°C glass transition)</li>
                    <li>Good chemical resistance</li>
                    <li>Less brittle — bends before breaking</li>
                </ul>
                <p><strong>Cons:</strong></p>
                <ul>
                    <li>More stringing (thin wisps between printed parts)</li>
                    <li>Requires tuned settings — less forgiving than PLA</li>
                    <li>Can stick too well to some beds (glass)</li>
                </ul>
                <p><strong>Best for:</strong> Functional parts, mechanical components, outdoor use, food-adjacent items.</p>
                <p><strong>Avoid for:</strong> Projects where stringing is unacceptable without post-processing.</p>

                <h3>ABS (Acrylonitrile Butadiene Styrene)</h3>
                <p>
                    <strong>What it is:</strong> Classic engineering thermoplastic — the same material
                    as LEGO bricks. Strong, durable, heat-resistant.
                </p>
                <p><strong>Pros:</strong></p>
                <ul>
                    <li>Excellent durability and impact resistance</li>
                    <li>High heat resistance (~100°C)</li>
                    <li>Can be vapor-smoothed with acetone for glass-like finish</li>
                    <li>Well-understood properties — decades of use</li>
                </ul>
                <p><strong>Cons:</strong></p>
                <ul>
                    <li>Heavy warping — requires enclosed printer</li>
                    <li>Produces fumes — needs ventilation</li>
                    <li>Harder to print reliably than PLA/PETG</li>
                </ul>
                <p><strong>Best for:</strong> Engineering parts, high-heat applications, parts that take abuse.</p>
                <p><strong>Avoid for:</strong> Beginners, open printers, poorly ventilated spaces.</p>

                <h3>TPU (Thermoplastic Polyurethane)</h3>
                <p>
                    <strong>What it is:</strong> A flexible, rubber-like material. Prints soft parts
                    that bend without breaking.
                </p>
                <p><strong>Pros:</strong></p>
                <ul>
                    <li>Flexible — bends, stretches, compresses</li>
                    <li>Excellent impact absorption</li>
                    <li>Great for gaskets, seals, wheels, grips</li>
                </ul>
                <p><strong>Cons:</strong></p>
                <ul>
                    <li>Difficult to print — slow speeds required</li>
                    <li>Direct drive extruder works better than Bowden</li>
                    <li>Stringing requires careful tuning</li>
                </ul>
                <p><strong>Best for:</strong> Phone cases, wheels, vibration dampeners, gaskets, flexible joints.</p>
                <p><strong>Avoid for:</strong> Structural parts, beginners, Bowden-style printers.</p>

                <h3>Specialty Materials</h3>
                <p>
                    <strong>ASA:</strong> Like ABS but UV-resistant. Excellent for outdoor use.
                    Still needs enclosure and ventilation.
                </p>
                <p>
                    <strong>Nylon:</strong> Extremely strong and wear-resistant. Excellent for
                    functional parts. Absorbs moisture — must be dried before printing.
                </p>
                <p>
                    <strong>PC (Polycarbonate):</strong> Very strong, very heat resistant.
                    Difficult to print — requires high temps and dry filament.
                </p>
                <p>
                    <strong>Carbon Fiber Composites:</strong> PLA, PETG, or Nylon reinforced with
                    carbon fiber. Stiffer and stronger. Abrasive — requires hardened nozzles.
                </p>

                <h3>How to Choose</h3>
                <p>Ask these questions:</p>
                <ul>
                    <li>Will it experience heat? → Not PLA</li>
                    <li>Will it be outdoors? → ASA or UV-treated PETG</li>
                    <li>Will it be under mechanical stress? → PETG, ABS, or Nylon</li>
                    <li>Does it need to flex? → TPU</li>
                    <li>Is it decorative and indoors? → PLA is fine</li>
                </ul>
                <p>
                    When in doubt, start with PETG. It covers most use cases with reasonable
                    print difficulty.
                </p>

                <h3>Storage Matters</h3>
                <p>
                    Many filaments absorb moisture from the air. Wet filament prints poorly —
                    bubbles, poor layer adhesion, surface defects. Store in sealed bags or
                    dry boxes with desiccant, especially Nylon and TPU.
                </p>
            </>
        )
    },
    "post-processing-fundamentals": {
        title: "Post-Processing Fundamentals",
        readTime: "16 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    A print coming off the bed is rarely finished. Post-processing transforms raw prints
                    into polished pieces. Here's what you need to know.
                </p>

                <h3>Support Removal</h3>
                <p>
                    Most complex prints require supports — temporary structures that hold up overhangs
                    during printing. Removing them is the first step.
                </p>
                <ul>
                    <li><strong>Breakaway supports:</strong> Snap off with pliers or by hand. Leave small nubs.</li>
                    <li><strong>Dissolvable supports:</strong> PVA dissolves in water. Takes hours but leaves clean surfaces.</li>
                    <li><strong>Tree supports:</strong> Easier to remove, less surface contact, but require good slicer settings.</li>
                </ul>
                <p>
                    Good support settings matter more than removal technique. If supports are
                    impossible to remove, the settings were wrong.
                </p>

                <h3>Sanding</h3>
                <p>
                    Sanding removes layer lines and imperfections. It's tedious but effective.
                </p>
                <ul>
                    <li>Start with 120-grit for major imperfections</li>
                    <li>Progress through 220, 400, 600 for smoother finish</li>
                    <li>Wet sanding (with water) produces finer results on PLA/ABS</li>
                    <li>Sand in one direction to avoid circular scratches</li>
                </ul>
                <p>
                    Sanding generates plastic dust. Use a mask and work in a ventilated area.
                </p>

                <h3>Filling and Priming</h3>
                <p>
                    For painted finishes, filling layer lines creates smoother surfaces.
                </p>
                <ul>
                    <li><strong>Filler primer:</strong> Spray-on coatings that fill small gaps. Multiple coats needed.</li>
                    <li><strong>Body filler:</strong> Two-part compounds for deep imperfections. Sand after curing.</li>
                    <li><strong>3D printing-specific fillers:</strong> Products designed for PLA/ABS compatibility.</li>
                </ul>

                <h3>Painting</h3>
                <p>
                    3D prints take paint well with proper preparation.
                </p>
                <ul>
                    <li>Prime first — paint adheres to primer better than raw plastic</li>
                    <li>Thin coats prevent drips and preserve detail</li>
                    <li>Acrylic paints work well on most filaments</li>
                    <li>Clear coat protects against wear and UV</li>
                </ul>

                <h3>Vapor Smoothing</h3>
                <p>
                    For ABS prints, acetone vapor can melt the surface to a glossy finish.
                </p>
                <ul>
                    <li>Suspend print over acetone in a sealed container</li>
                    <li>Vapor melts the surface layer, smoothing lines</li>
                    <li>Easy to over-do — details can blur quickly</li>
                    <li>Requires ventilation — acetone vapor is flammable and toxic</li>
                </ul>
                <p>
                    This only works on ABS. PLA does not react to acetone.
                </p>

                <h3>Heat Treatment</h3>
                <p>
                    Annealing prints in an oven can increase strength and heat resistance.
                </p>
                <ul>
                    <li>Controlled heating realigns polymer chains</li>
                    <li>Parts may warp — use a mold or support structure</li>
                    <li>Temperature and time depend on material</li>
                    <li>Results vary — experiment on test pieces first</li>
                </ul>

                <h3>When to Stop</h3>
                <p>
                    Not every print needs post-processing. Functional parts that no one sees?
                    Leave them raw. Decorative pieces for display? Polish them up.
                </p>
                <p>
                    Post-processing is a skill. The more you do it, the faster you get.
                    But the first step is deciding if it's worth doing at all.
                </p>
            </>
        )
    },
    "when-to-print-vs-buy": {
        title: "When to Print vs Buy",
        readTime: "12 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    3D printing is powerful, but it's not always the right choice.
                    Here's how to think about when printing makes sense and when buying doesn't.
                </p>

                <h3>The Real Cost of Printing</h3>
                <p>
                    Material cost is just the beginning. Factor in:
                </p>
                <ul>
                    <li><strong>Time:</strong> Design, slicing, printing, post-processing</li>
                    <li><strong>Failure rate:</strong> Some prints fail. Material and time are lost.</li>
                    <li><strong>Equipment wear:</strong> Nozzles, belts, and other parts wear out</li>
                    <li><strong>Learning curve:</strong> Your time learning has value</li>
                    <li><strong>Electricity:</strong> Printers draw power for hours</li>
                </ul>
                <p>
                    Often, the "cheap" printed option costs more than buying when you account
                    for everything.
                </p>

                <h3>When Printing Wins</h3>
                <p>
                    <strong>Custom dimensions:</strong> If you need an exact size that doesn't exist
                    commercially, printing is often the only option.
                </p>
                <p>
                    <strong>Iteration and prototyping:</strong> When you need to test multiple versions
                    quickly, printing beats ordering and waiting.
                </p>
                <p>
                    <strong>Unavailable parts:</strong> Replacement parts for discontinued products.
                    Specialty items no one manufactures.
                </p>
                <p>
                    <strong>Learning and skill-building:</strong> The value isn't just the object —
                    it's the capability you're developing.
                </p>

                <h3>When Buying Wins</h3>
                <p>
                    <strong>Commodity items:</strong> Basic brackets, hooks, containers.
                    Mass-produced versions are cheaper and often stronger.
                </p>
                <p>
                    <strong>High-stress applications:</strong> Metal, injection-molded plastic, and
                    professionally manufactured parts beat printed equivalents for reliability.
                </p>
                <p>
                    <strong>Time-sensitive needs:</strong> If you need it today, Amazon wins.
                    Printing takes hours or days.
                </p>
                <p>
                    <strong>Food contact:</strong> Printed parts have layer lines that harbor bacteria.
                    Commercial food-safe items are purpose-built.
                </p>

                <h3>The Decision Framework</h3>
                <p>Ask yourself:</p>
                <ol>
                    <li>Does a commercial option exist that meets my needs?</li>
                    <li>What's my time worth on this project?</li>
                    <li>How important is material performance (strength, heat, safety)?</li>
                    <li>Am I using this as a learning opportunity?</li>
                    <li>How urgently do I need it?</li>
                </ol>
                <p>
                    If you answer honestly, the right choice usually becomes clear.
                </p>

                <h3>The Hybrid Approach</h3>
                <p>
                    Sometimes the answer is both. Buy the main component, print the adapter
                    or mount. Use commercial fasteners with printed housings. Combine
                    the strengths of each approach.
                </p>
            </>
        )
    },
    "pricing-prints-fairly": {
        title: "How to Price Prints Fairly",
        readTime: "14 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    If you're selling prints, pricing is hard. Charge too little and you're
                    working for pennies. Charge too much and you're exploiting customers.
                    Here's how to find the balance.
                </p>

                <h3>Understanding Your Costs</h3>
                <p>
                    <strong>Material:</strong> Calculate actual filament used, not spool price.
                    Slicers estimate grams. Multiply by cost per gram.
                </p>
                <p>
                    <strong>Electricity:</strong> Roughly $0.10-0.25 CAD per print hour,
                    depending on your rates and printer power draw.
                </p>
                <p>
                    <strong>Machine time:</strong> Your printer has a lifespan. Each hour of
                    printing uses some of that lifespan. Factor in eventual replacement.
                </p>
                <p>
                    <strong>Failures:</strong> If you fail 10% of prints, build that into pricing.
                    Every successful print covers part of a failed one.
                </p>

                <h3>Valuing Your Time</h3>
                <p>
                    This is where most people under-price. Your time includes:
                </p>
                <ul>
                    <li>Customer communication</li>
                    <li>File preparation and slicing</li>
                    <li>Print monitoring</li>
                    <li>Post-processing</li>
                    <li>Packaging and shipping</li>
                </ul>
                <p>
                    If you wouldn't work for $5/hour at a job, don't accept it in your
                    print business. Your expertise has value.
                </p>

                <h3>Pricing Models</h3>
                <p>
                    <strong>Cost-plus:</strong> Calculate costs, add margin (30-50%+). Simple but
                    may underprice complex work.
                </p>
                <p>
                    <strong>Time-based:</strong> Charge per hour of print time plus setup fee.
                    Fair for both parties but harder to quote quickly.
                </p>
                <p>
                    <strong>Volume-based:</strong> Charge per cubic centimeter of print volume.
                    Easy to calculate from slicer output.
                </p>
                <p>
                    <strong>Value-based:</strong> What is this worth to the customer?
                    A custom replacement part saving a $500 repair is worth more than material cost.
                </p>

                <h3>Common Mistakes</h3>
                <ul>
                    <li>Ignoring your time (working for free)</li>
                    <li>Not accounting for failure rate</li>
                    <li>Pricing to match overseas factories (you can't)</li>
                    <li>Discounting for "exposure" or "volume" that never materializes</li>
                    <li>Forgetting shipping and packaging costs</li>
                </ul>

                <h3>The Human Element</h3>
                <p>
                    Fair pricing isn't just math. It's respect — for yourself, your skills,
                    and your customers. A sustainable price lets you continue doing good work.
                    An unsustainable one burns you out or forces you to cut corners.
                </p>
                <p>
                    You're offering a service that requires equipment, skill, and time.
                    Price it accordingly.
                </p>
            </>
        )
    },
    "choosing-filaments-responsibly": {
        title: "Choosing Filaments Responsibly",
        readTime: "13 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    Every spool of filament has an environmental footprint. Here's how
                    to make material choices you can feel better about.
                </p>

                <h3>The Uncomfortable Truth</h3>
                <p>
                    Most 3D printing filaments are plastic. PLA is marketed as "biodegradable,"
                    but only in industrial composting facilities — not your backyard or a landfill.
                    PETG, ABS, and other materials are effectively permanent.
                </p>
                <p>
                    3D printing is often positioned as "sustainable" because it reduces material
                    waste compared to subtractive manufacturing. This is partially true, but
                    it doesn't mean printing is environmentally neutral.
                </p>

                <h3>Material Comparisons</h3>
                <p>
                    <strong>PLA:</strong> Made from corn starch or sugarcane. Lower carbon footprint
                    to produce than petroleum-based plastics. But farming corn uses land, water,
                    and fertilizers. And PLA doesn't biodegrade in normal conditions.
                </p>
                <p>
                    <strong>PETG:</strong> Chemically similar to recyclable water bottles, but
                    contaminated PETG (like printed parts) disrupts recycling streams.
                    Most municipalities won't accept it.
                </p>
                <p>
                    <strong>ABS:</strong> Petroleum-based, produces fumes during printing, and
                    is not recyclable through consumer channels. Durable, which means
                    parts last longer — but also persist longer when discarded.
                </p>

                <h3>Recycled Filaments</h3>
                <p>
                    Some manufacturers offer recycled filaments (rPLA, rPETG). These take
                    post-industrial or post-consumer waste and turn it back into usable material.
                </p>
                <ul>
                    <li>Quality can be inconsistent — voids, color variation</li>
                    <li>Usually costs the same or more than virgin material</li>
                    <li>Still ends up as waste eventually unless recycled again</li>
                    <li>Better than virgin — but not zero-impact</li>
                </ul>

                <h3>Reducing Waste</h3>
                <p>
                    The best environmental choice is printing less. When you do print:
                </p>
                <ul>
                    <li><strong>Design intentionally:</strong> Right-size parts. Don't over-engineer.</li>
                    <li><strong>Minimize supports:</strong> Better orientation = less waste</li>
                    <li><strong>Test at small scale:</strong> Prototype tiny before printing big</li>
                    <li><strong>Reduce failures:</strong> Good calibration = fewer failed prints</li>
                    <li><strong>Print for durability:</strong> A part that lasts 10 years beats one that breaks in 1</li>
                </ul>

                <h3>End-of-Life Options</h3>
                <p>
                    <strong>Recycling programs:</strong> Some communities have filament recycling.
                    Some companies take back spools. Check availability in your area.
                </p>
                <p>
                    <strong>Home recyclers:</strong> Machines that shred failed prints and extrude
                    new filament exist. Expensive and require consistent material streams.
                </p>
                <p>
                    <strong>Honest disposal:</strong> If it's going in the garbage, at least don't
                    pretend otherwise. Greenwashing helps no one.
                </p>

                <h3>Making Better Choices</h3>
                <p>
                    Perfect environmental choices don't exist in 3D printing. But better ones do.
                    Print what you need. Choose recycled when possible. Design for longevity.
                    Don't print junk for the sake of printing.
                </p>
            </>
        )
    },
    "designing-for-strength": {
        title: "Designing for Strength vs Looks",
        readTime: "15 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    A beautiful print that breaks is a failure. A strong print nobody wants to
                    look at is also a failure. Here's how to balance structural integrity with aesthetics.
                </p>

                <h3>How Prints Fail</h3>
                <p>
                    Understanding failure modes helps you prevent them:
                </p>
                <ul>
                    <li><strong>Layer separation:</strong> Prints are weakest between layers. Stress parallel to layers causes delamination.</li>
                    <li><strong>Cracking:</strong> Brittle materials (PLA) crack under impact or bending.</li>
                    <li><strong>Warping:</strong> Internal stress causes parts to deform over time or under load.</li>
                    <li><strong>Thin wall failure:</strong> Walls too thin to handle stress.</li>
                </ul>

                <h3>Orientation Matters Most</h3>
                <p>
                    The single biggest impact on strength is how you orient the print.
                    Layer lines are weak points. Stress should run along layers, not across them.
                </p>
                <p>
                    A hook printed flat (horizontal layers) will be much weaker than the same
                    hook printed standing (vertical layers along the stress direction).
                </p>

                <h3>Wall Thickness</h3>
                <p>
                    Standard wall thickness is 0.8-1.2mm (2-3 perimeters with a 0.4mm nozzle).
                    Functional parts often need more:
                </p>
                <ul>
                    <li>High-stress parts: 1.6-2.4mm walls</li>
                    <li>Snap fits and clips: minimum 1.2mm</li>
                    <li>Decorative parts: 0.8mm is often fine</li>
                </ul>

                <h3>Infill: The Inside Story</h3>
                <p>
                    Infill provides internal structure. Common patterns include:
                </p>
                <ul>
                    <li><strong>Grid:</strong> Simple, moderate strength in all directions</li>
                    <li><strong>Gyroid:</strong> Excellent omnidirectional strength, slower to print</li>
                    <li><strong>Lightning:</strong> Minimal infill for support only — not for functional parts</li>
                    <li><strong>Cubic:</strong> Good strength, efficient material use</li>
                </ul>
                <p>
                    Higher infill percentage doesn't always mean more strength. After 40-50%,
                    returns diminish rapidly. Often, more perimeters beat more infill.
                </p>

                <h3>Designing for Load</h3>
                <p>
                    Think about how forces will act on your part:
                </p>
                <ul>
                    <li>Add fillets to internal corners (stress concentrators)</li>
                    <li>Use chamfers instead of sharp edges</li>
                    <li>Distribute load across larger areas</li>
                    <li>Avoid thin sections in load paths</li>
                </ul>

                <h3>Balancing Looks</h3>
                <p>
                    Sometimes you need both aesthetics and function:
                </p>
                <ul>
                    <li>External appearance can be optimized while internal structure handles load</li>
                    <li>Visible faces oriented for best surface quality</li>
                    <li>Support contact on non-visible surfaces</li>
                    <li>Post-processing to smooth areas that affect appearance but not strength</li>
                </ul>

                <h3>Testing</h3>
                <p>
                    If strength matters, test it. Print a prototype and try to break it.
                    See where it fails. Adjust orientation, walls, or infill. Test again.
                </p>
                <p>
                    Real-world testing beats theoretical calculations every time.
                </p>
            </>
        )
    },
    "understanding-tolerances": {
        title: "Understanding Tolerances",
        readTime: "14 min",
        content: (
            <>
                <p className="text-lg font-medium text-foreground">
                    You designed two parts to fit together. They don't. Welcome to tolerances —
                    the gap between what you design and what actually prints.
                </p>

                <h3>Why Things Don't Fit</h3>
                <p>
                    A 10mm hole in CAD rarely prints as exactly 10mm. Factors include:
                </p>
                <ul>
                    <li><strong>Material shrinkage:</strong> Most plastics shrink slightly as they cool</li>
                    <li><strong>Extrusion width:</strong> The nozzle creates paths wider than the nominal line</li>
                    <li><strong>First layer squish:</strong> Over-squished first layers expand outward</li>
                    <li><strong>Thermal expansion:</strong> Parts may expand during hot printing and shrink when cool</li>
                    <li><strong>Calibration:</strong> Printers that aren't calibrated produce parts the wrong size</li>
                </ul>

                <h3>Typical Tolerance Values</h3>
                <p>
                    For well-calibrated FDM printers:
                </p>
                <ul>
                    <li><strong>Holes:</strong> Often print 0.2-0.4mm smaller than designed</li>
                    <li><strong>Outer dimensions:</strong> Often print 0.1-0.3mm larger than designed</li>
                    <li><strong>Press-fit interference:</strong> 0.2-0.3mm for tight fits</li>
                    <li><strong>Sliding fit clearance:</strong> 0.3-0.5mm for parts that move freely</li>
                </ul>
                <p>
                    These vary by printer, material, and settings. Your printer may differ.
                </p>

                <h3>Designing for Tolerance</h3>
                <p>
                    The solution isn't hoping for perfect prints — it's designing for imperfection.
                </p>
                <ul>
                    <li><strong>Clearance holes:</strong> Add 0.3-0.5mm to hole diameters</li>
                    <li><strong>Mating parts:</strong> Print test pieces first, measure, adjust design</li>
                    <li><strong>Captive designs:</strong> Design so parts can be adjusted after printing</li>
                    <li><strong>Post-processing:</strong> Drill holes to final size, file edges</li>
                </ul>

                <h3>Calibrating Your Printer</h3>
                <p>
                    Before blaming the design, calibrate:
                </p>
                <ol>
                    <li>Print a calibration cube (20x20x20mm)</li>
                    <li>Measure all three dimensions with calipers</li>
                    <li>Adjust steps/mm or slicer scaling if consistently off</li>
                    <li>Print again and verify</li>
                </ol>
                <p>
                    Also calibrate extrusion (e-steps) and flow rate. Over-extrusion causes
                    dimensional errors.
                </p>

                <h3>Material-Specific Considerations</h3>
                <ul>
                    <li><strong>PLA:</strong> Low shrinkage, relatively accurate</li>
                    <li><strong>ABS:</strong> Significant shrinkage (up to 2%), needs compensation</li>
                    <li><strong>PETG:</strong> Moderate shrinkage, slight squish expansion</li>
                    <li><strong>Nylon:</strong> Absorbs moisture, dimensions change over time</li>
                </ul>

                <h3>Test, Measure, Iterate</h3>
                <p>
                    The only reliable way to achieve good fits is iterative testing.
                    Print small test pieces. Measure them. Adjust. Repeat until it works.
                </p>
                <p>
                    Document what works for your printer and materials. Build a reference
                    of compensation values you can reuse.
                </p>
            </>
        )
    }
};

/**
 * Learn Article Page
 * Individual learning guide with full educational content.
 */
export default function LearnArticle() {
    const { slug } = useParams();
    const article = slug ? learnContent[slug] : null;

    if (!article) {
        return (
            <div className="min-h-screen bg-background py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                        Guide Not Found
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        This learning guide doesn't exist or has been moved.
                    </p>
                    <Link to="/learn">
                        <NeonButton variant="secondary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Learning Guides
                        </NeonButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back Link */}
                <Link to="/learn" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Learning Guides
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center gap-2 px-3 py-1 text-xs bg-secondary/10 text-secondary rounded-full">
                            <BookOpen className="w-3 h-3" />
                            Learning Guide
                        </span>
                        <span className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.readTime} read
                        </span>
                    </div>
                    <h1 className="text-4xl font-display font-bold gradient-text">
                        {article.title}
                    </h1>
                </div>

                {/* Content */}
                <GlassPanel className="p-8 mb-12">
                    <div className="prose prose-invert max-w-none">
                        <div className="space-y-4 text-muted-foreground [&>h3]:text-foreground [&>h3]:font-tech [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:leading-relaxed [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>p.text-lg]:text-foreground [&>p.text-lg]:mb-6">
                            {article.content}
                        </div>
                    </div>
                </GlassPanel>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                        Questions about this topic? Reach out at hello@3d3d.ca
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link to="/learn">
                            <NeonButton variant="secondary">
                                More Learning Guides
                            </NeonButton>
                        </Link>
                        <Link to="/blog">
                            <NeonButton variant="primary">
                                Read Our Blog
                            </NeonButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
