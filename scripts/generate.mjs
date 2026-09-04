import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const personalLines = [
  {
    slug: "homeowners-insurance",
    name: "Homeowners Insurance",
    summary: "Coverage for primary homes, secondary homes, seasonal homes, condos, and rental properties.",
    simple: "Homeowners insurance is the policy that protects the house you live in — and often the people and belongings inside it. If a fire, storm, theft, or a lawsuit happens, this is usually the first policy that responds.",
    details: "Think of a homeowners policy as four jobs in one. It can help rebuild or repair the house (dwelling), cover other structures like a garage or fence, replace personal belongings, and pay if someone is hurt on your property and you are responsible. Many policies also help with extra living costs if you cannot stay in the home while it is being repaired. We write coverage for primary homes, second homes, seasonal houses, condominiums, and rental properties. The right version depends on how the property is used, how it is built, and what it would cost to rebuild today — not what you paid years ago.",
    who: ["People who own the home they live in", "Owners of a second or vacation home", "Landlords who rent a house to tenants", "Anyone a mortgage lender requires to keep the property insured"],
    covers: ["The house itself and attached structures", "Personal belongings such as furniture, clothing, and electronics", "Liability if a guest is injured and you are responsible", "Additional living expenses if the home is temporarily unlivable"],
    example: "A kitchen fire damages cabinets, smoke-fills bedrooms, and forces the family into a hotel for two weeks. The policy can help pay to repair the kitchen, replace damaged belongings, and cover the hotel — subject to the deductible and limits.",
    notes: ["Flood and earthquake are usually not included and need their own policies.", "Rebuild cost often rises faster than market value, so limits should be reviewed at renewal."],
  },
  {
    slug: "auto-insurance",
    name: "Auto Insurance",
    summary: "Protection for cars, motorcycles, motorhomes, and recreational vehicles.",
    simple: "Auto insurance pays when a vehicle you drive causes injury or damage — and, if you choose the right coverages, when your own vehicle is wrecked, stolen, or damaged by weather.",
    details: "A personal auto policy is built in layers. Liability pays other people if you cause an accident. Collision pays to repair your vehicle after a crash. Comprehensive pays for non-crash damage such as hail, theft, or hitting an animal. Uninsured and underinsured motorist coverage helps if the other driver has little or no insurance. We also look at motorcycles, motorhomes, and recreational vehicles, which often need their own forms instead of being forced onto a regular car policy. Multi-car households can often package vehicles together for simpler billing and better pricing.",
    who: ["Anyone who owns or regularly drives a personal vehicle", "Households with several cars", "Motorcycle, motorhome, and RV owners", "New drivers being added to a family policy"],
    covers: ["Injuries and property damage you cause to others", "Damage to your own vehicle, if you carry those coverages", "Hit-and-run or uninsured driver situations", "Certain roadside or rental-car options, when added"],
    example: "You are rear-ended at a light and the other driver has only minimum limits. Your medical bills and car repairs can exceed what they carry. Uninsured/underinsured coverage on your policy is what fills that gap.",
    notes: ["A personal auto policy is usually the wrong place for a vehicle titled to a business or used mainly for deliveries.", "Deductibles and liability limits should match what you can actually afford to pay out of pocket."],
  },
  {
    slug: "renters-insurance",
    name: "Renters Insurance",
    summary: "Coverage for personal property and liability for renters.",
    simple: "If you rent, your landlord’s insurance covers the building — not your sofa, laptop, or a lawsuit if a guest is hurt in your apartment. Renters insurance is the policy that covers you.",
    details: "Renters insurance is often inexpensive compared with the cost of replacing everything you own. It typically covers personal property against fire, theft, and certain other named events, and it includes personal liability. Many policies also pay extra living expenses if a covered loss makes the unit unlivable. Landlords almost never pay to replace a tenant’s belongings. Some leases now require proof of renters coverage before you move in.",
    who: ["Apartment and house renters", "Students living off campus", "Anyone whose lease requires proof of insurance", "Roommates who want their own belongings protected"],
    covers: ["Your personal belongings, not the building", "Liability if someone is injured in the rented home and you are responsible", "Additional living expenses after a covered loss", "Theft of belongings from the unit, subject to the policy"],
    example: "A pipe bursts two floors up and ruins your furniture and clothes. The building policy may repair the walls. Your renters policy is what helps replace the items that were yours.",
    notes: ["High-value jewelry, art, or electronics may need a scheduled endorsement.", "This is not a substitute for flood coverage if the unit is in a flood-prone area."],
  },
  {
    slug: "condo-insurance",
    name: "Condo Insurance",
    summary: "Specialized coverage for condominium owners.",
    simple: "A condo is not a house and not a rental apartment. The association insures the building. You need a separate policy for the inside of your unit, your belongings, and your share of certain association losses.",
    details: "Condo coverage (often called an HO-6) is built to sit next to the association’s master policy. The master policy usually covers the structure and common areas. Your policy is meant to pick up unit interiors, upgrades you paid for (a remodeled kitchen, better floors), personal property, loss of use, personal liability, and often loss assessment — a bill the association sends owners after a large claim. We review the association bylaws and master policy so you are not paying twice for the same wall, or leaving a gap between “bare walls” and “all-in.” The same idea applies if you own a condo as a rental.",
    who: ["Owner-occupants of a condominium", "Investors who rent out a condo unit", "Buyers who have just closed and need to satisfy the lender", "Owners facing a special assessment after a building claim"],
    covers: ["Interior finishes and improvements you own", "Personal belongings", "Personal liability", "Loss assessment charged by the association, when included"],
    example: "A fire starts in another unit and the association assesses every owner $15,000. Loss assessment coverage on your condo policy is designed for that kind of bill — up to the limit you purchased.",
    notes: ["Always match the policy to the association’s master form, not to a standard house policy.", "Improvements you made after purchase are easy to underinsure if no one updates the limit."],
  },
  {
    slug: "personal-umbrella",
    name: "Personal Umbrella",
    summary: "Additional liability protection above auto and homeowners policies.",
    simple: "An umbrella policy is extra liability insurance. It sits on top of your auto and home (or renters/condo) policies and starts paying after those policies run out.",
    details: "A serious car accident or a lawsuit from an injury at your house can exceed the $300,000 or $500,000 on a standard policy very quickly. An umbrella adds another $1 million or more of liability protection and can also cover some claims the underlying policies do not. It does not replace auto or homeowners coverage — you still need those policies, usually at required minimum limits, for the umbrella to attach. Households with teen drivers, a pool, a trampoline, rental properties, boats, or meaningful savings and future income are the typical buyers. The cost is often modest compared with the limit you are buying.",
    who: ["Households with savings, investments, or future earnings to protect", "Families with teen drivers", "Owners of pools, boats, or rental properties", "Anyone whose current liability limits feel too thin"],
    covers: ["Liability above auto and home policy limits", "Certain lawsuits for injury or damage you cause", "Defense costs as described in the policy", "Some exposures that underlying policies handle only in part"],
    example: "A multi-car accident produces $1.4 million in injuries. Your auto policy pays its $500,000 limit. The umbrella is what is designed to respond to the rest, up to its limit.",
    notes: ["You usually must carry stated minimum limits on auto and home first.", "An umbrella is liability only — it does not repair your house or your car."],
  },
  {
    slug: "watercraft-insurance",
    name: "Watercraft / Boat Insurance",
    summary: "Coverage for boats and watercraft.",
    simple: "A boat is not automatically covered the way a sofa is. Most homeowners policies give little or no protection once the boat is in the water. Boat insurance is the policy written for the vessel itself.",
    details: "Watercraft coverage can pay to repair or replace the hull, cover you if you injure someone or damage another boat, and add extras such as medical payments, uninsured boaters, and on-water towing. The right policy depends on the type of vessel, horsepower, where you use it, and whether it is stored on a trailer, in a slip, or on a lift. Small fishing boats, personal watercraft, and larger pleasure craft are not treated the same. We also look at whether the boat should sit under a homeowners endorsement or needs a standalone policy, and how it works with an umbrella.",
    who: ["Owners of boats, jet skis, and other pleasure craft", "Families who trailer a boat between lakes", "Households that already carry home and auto and want the boat tied in", "Anyone a marina or lender requires to show proof of insurance"],
    covers: ["Physical damage to the boat and, often, the trailer", "Liability if you cause injury or damage on the water", "On-water towing or assistance, when included", "Passenger medical payments, when included"],
    example: "A hidden stump damages the lower unit on a Saturday afternoon. Hull coverage can help pay the repair. If you also injure a skier, liability is the part that responds to that claim.",
    notes: ["Homeowners policies often cap or exclude boats above a certain length or horsepower.", "Lay-up periods, navigation limits, and operator age rules are common — read them before the season starts."],
  },
  {
    slug: "flood-insurance",
    name: "Flood Insurance",
    summary: "Protection against flood-related damage.",
    simple: "If water comes from overflowing rain, a river, storm surge, or the ground, a normal homeowners or renters policy usually will not pay. Flood insurance is a separate policy for that specific risk.",
    details: "Flood is one of the most common — and most misunderstood — gaps in personal insurance. A standard home policy is built for fire, wind, and theft, not for water that rises from outside. Flood coverage can be written for the building, the contents, or both. It matters in mapped high-risk zones, where a mortgage lender often requires it, and it also matters outside those zones. A large share of flood claims happen in areas that were never labeled “high risk.” We help you look at the address, the elevation story, and whether you need building coverage, contents coverage, or both — including for second homes and rentals.",
    who: ["Homeowners in or near flood zones", "Buyers whose lender requires flood coverage to close", "Owners outside a mapped zone who still have drainage or surge risk", "Renters who want contents coverage for flood"],
    covers: ["Building damage from covered flooding", "Belongings, if you buy contents coverage", "Certain cleanup and repair costs described in the policy", "Homes and many other residential buildings in participating communities"],
    example: "A slow-moving storm drops a foot of rain. Water comes in through the garage and ruins flooring, appliances, and boxed belongings. Without a flood policy, the homeowners claim for that water is often denied.",
    notes: ["There is typically a waiting period before a new flood policy takes effect, so do not wait for the storm forecast.", "This is not the same as a sewer-backup endorsement, which is a different kind of water claim."],
  },
];

const commercialLines = [
  {
    slug: "general-liability",
    name: "General Liability",
    summary: "Core protection if a third party alleges bodily injury or property damage arising from business operations.",
    simple: "General liability is the policy that helps if your business accidentally hurts someone or damages someone else’s property. Landlords, clients, and general contractors almost always ask for it.",
    details: "If a customer slips in your shop, a visitor is hurt at your office, or your work damages a neighboring suite, general liability is the coverage designed to respond. It can also address certain advertising or reputation-type claims, and it typically pays to defend you even while the facts are being sorted out. It does not cover your own building, your employees’ on-the-job injuries, or professional mistakes — those are separate policies. For most businesses, this is the first commercial policy we put in place, then we build the rest of the program around it.",
    who: ["Offices, shops, and service businesses", "Contractors who must give certificates to general contractors", "Companies signing leases that require $1 million of liability", "Any firm that has customers or vendors on site"],
    covers: ["Injuries to people who are not your employees", "Damage to other people’s property", "Certain personal and advertising injury claims", "Legal defense costs as the policy describes"],
    example: "A delivery person trips on a worn stair and breaks a wrist. Medical bills and a lawsuit follow. General liability is the policy that can pay defense and settlement, up to the limit.",
    notes: ["This is not workers’ compensation and not professional liability.", "Contracts often require extra insured wording — we match the certificate to the job, not the other way around."],
  },
  {
    slug: "commercial-property",
    name: "Commercial Property / Buildings",
    summary: "Coverage for buildings, business personal property, and related property exposures.",
    simple: "Commercial property insurance pays to repair or replace the building and the business property inside it after a covered event such as fire, wind, or theft.",
    details: "If you own the building, the policy can cover the structure. If you lease, it can cover your tenant improvements, furniture, inventory, and equipment. The two numbers that matter most are how the property is valued (replacement cost versus actual cash value) and whether the limit would actually rebuild or restock you today. We also look at deductibles, coinsurance, and whether business income should be added so you can keep paying rent and payroll while the location is closed. Owner-occupied buildings and investment properties are both in scope.",
    who: ["Business owners who occupy their own building", "Investors who own retail, office, or industrial space", "Tenants with expensive build-outs or inventory", "Anyone a lender requires to insure the collateral"],
    covers: ["The building, if you own it or are required to insure it", "Furniture, fixtures, inventory, and equipment", "Tenant improvements you paid for", "Optional business income after a covered shutdown"],
    example: "A nighttime fire takes out a retail suite and the stock on the floor. Property coverage is what pays to rebuild and restock. Business income, if you added it, is what helps replace the sales you lost while closed.",
    notes: ["Flood and earthquake are typically excluded.", "A cheap limit that cannot rebuild the building is not a savings — it is a coinsurance problem waiting to happen."],
  },
  {
    slug: "commercial-auto",
    name: "Commercial Auto / Fleet",
    summary: "Protection for business vehicles and fleets used in daily operations.",
    simple: "If the vehicle is titled to the business, or used mainly for work, a personal auto policy is usually the wrong policy. Commercial auto is the version written for work vehicles and fleets.",
    details: "Commercial auto covers liability and, if you choose it, physical damage for vehicles the business owns. It can also cover hired autos (vehicles you rent) and non-owned autos (employees running errands in their own cars on company business). That last piece surprises a lot of owners. One service van, a small contractor fleet, or a dozen delivery units can all sit on this form. We look at driver lists, radius of use, and whether any vehicle is doing something a personal policy would exclude — like deliveries or carrying tools to job sites all day.",
    who: ["Contractors and trades with work trucks or vans", "Distributors and service companies", "Any business that rents vehicles or has staff driving their own cars for work", "Companies whose personal insurer has already said “this is commercial use”"],
    covers: ["Liability for accidents involving business vehicles", "Collision and comprehensive on owned units, if carried", "Hired and non-owned auto, when added", "Fleets from one vehicle up"],
    example: "An employee grabs a rental van for a job and backs into a parked car. Hired-auto coverage on the commercial policy is what is supposed to respond — not the employee’s personal policy.",
    notes: ["Putting a work truck on a personal auto policy can leave a claim unpaid.", "Driver records and vehicle use have to be described honestly or the policy may not perform."],
  },
  {
    slug: "workers-compensation",
    name: "Workers’ Compensation",
    summary: "Statutory coverage for employee workplace injuries and related employer obligations.",
    simple: "Workers’ compensation pays medical bills and a portion of lost wages when an employee is hurt on the job. In most states, if you have employees, the law says you need it.",
    details: "This is not a “nice to have.” It is the coverage state law uses so an injured employee does not have to sue the employer to get medical care and wage replacement. In return, the employer generally receives protection from many related lawsuits. Premium is driven by payroll and by class codes — a desk job is priced differently from roofing. We review headcount, how people actually spend their day, and whether 1099 help should really be treated as employees. Contractors often cannot step on a job site without a workers’ comp certificate.",
    who: ["Any employer with W-2 staff, in states that require it", "Contractors who must show certificates to get on site", "Growing companies hiring their first employees", "Businesses using a mix of employees and subcontractors"],
    covers: ["Medical treatment for workplace injuries", "A portion of lost wages, as the state law provides", "Employer’s liability for certain related claims", "Compliance with state statutory requirements"],
    example: "A warehouse employee strains a back lifting a pallet. Workers’ compensation is designed to pay the doctor and part of the missed wages. Without it, the business may face both the bill and a lawsuit.",
    notes: ["Rules and required limits vary by state.", "Misclassifying employees as contractors is one of the fastest ways to create a gap."],
  },
  {
    slug: "business-owners-policy",
    name: "Business Owners Policy (BOP)",
    summary: "A packaged approach that combines property and liability for many small and midsize businesses.",
    simple: "A BOP is a bundle. Instead of buying general liability and commercial property as two separate policies, many small businesses buy them together in one package — often with business-income coverage available.",
    details: "The BOP exists because a lot of offices, shops, and service firms need the same two things: protect the stuff, and protect the business if someone gets hurt. Packaging them can be simpler and more cost-effective than a custom policy. It is not the right box for every company. Heavy manufacturing, large contractors, and unusual operations often need a separate commercial package. We use the BOP when the business fits, and we step up to a custom program when it does not.",
    who: ["Small and midsize offices", "Retail and light service businesses", "Professional firms with a simple location", "Owners who want one policy instead of two to start"],
    covers: ["General liability", "Business personal property and, if needed, the building", "Optional business income", "Selected endorsements for the way the shop actually runs"],
    example: "A design studio has rented space, computers, and clients walking in. A BOP can cover the contents and the slip-and-fall exposure in one policy, which is usually cleaner than buying each piece alone.",
    notes: ["A BOP is a starting structure, not a complete risk program. Auto, workers’ comp, and professional liability are still separate.", "If the business outgrows the BOP eligibility rules, we move it to a full package."],
  },
  {
    slug: "artisan-contractors",
    name: "Artisan Contractors Insurance",
    summary: "Coverage tailored for trade contractors and specialty artisans.",
    simple: "Artisan contractor insurance is a program built for trades — electricians, plumbers, painters, carpenters, HVAC techs — who work on other people’s property and need certificates to get paid.",
    details: "A trade contractor’s risk is not an office risk. You are on job sites, using tools, driving to work, and often hiring helpers. The core is general liability written for the trade, then we add tools and equipment, commercial auto, and workers’ compensation as the operation needs them. General contractors and property managers will ask for specific limits, additional-insured wording, and sometimes a waiver of subrogation. We set the program up so the certificate matches the work you actually do — residential remodel, service, or light commercial — instead of a generic office policy that fails the first audit.",
    who: ["Licensed trades and specialty artisans", "One-person shops through small crews", "Subcontractors who must give certificates to a GC", "Trades adding a first employee or a work truck"],
    covers: ["Job-site general liability", "Tools and equipment, when added", "Work vehicles, when added", "Workers’ compensation, when you have employees"],
    example: "You nick a water line while opening a wall and flood a finished kitchen. Contractor liability is the coverage meant to respond to that property damage — not your personal homeowners policy.",
    notes: ["Your personal home or auto policy is not a contractor policy.", "Tell us about new services (roofing, excavation, wrapping) before you bid them. Appetite changes with the work."],
  },
  {
    slug: "professional-liability",
    name: "Professional Liability (E&O)",
    summary: "Protection against claims alleging professional mistakes, omissions, or negligent advice.",
    simple: "If a client says your advice, design, or professional service cost them money, general liability usually will not help. Errors and omissions coverage is the policy for that kind of claim.",
    details: "General liability is about bodily injury and property damage. Professional liability is about financial harm from a mistake, a missed deadline, or advice that did not work out. Consultants, accountants, architects, insurance agents, IT firms, and many other practices need it — and many client contracts require it. The policy can pay to defend you and to settle covered claims. Limits and deductibles should match the size of the engagements you take on, not just the cheapest quote.",
    who: ["Consultants, advisors, and professional firms", "Anyone whose contract requires E&O", "Practices that give written recommendations or designs", "Firms moving from a side hustle into formal client work"],
    covers: ["Claims that you made a professional mistake or omission", "Defense of those claims, as the policy provides", "Settlements or judgments for covered errors", "Often prior-acts or tail options when the practice changes"],
    example: "A consultant misses a filing deadline and the client is fined. The client sues for the fine and lost business. That is an E&O claim, not a general-liability slip-and-fall.",
    notes: ["General liability and E&O are complementary, not substitutes.", "Claims-made policies need attention when you retire, sell, or switch carriers."],
  },
  {
    slug: "inland-marine",
    name: "Inland Marine / Heavy Machinery",
    summary: "Coverage for equipment, tools, and machinery in transit, on job sites, or away from premises.",
    simple: "A building policy protects things that stay in the building. Inland marine protects tools, machinery, and equipment that move — on a truck, at a job site, or sitting in a yard.",
    details: "The name is old. The idea is simple. If a $40,000 lift, a set of specialty tools, or a piece of heavy equipment leaves the shop, a standard property policy may cover little or none of it. Contractors equipment and inland marine forms can schedule specific machines or blanket a class of tools. We look at where the equipment lives overnight, how it is transported, and whether leased or borrowed machines should be included. This is one of the most common gaps we find in contractor and logistics accounts.",
    who: ["Contractors with tools and machines on job sites", "Companies that haul or store equipment away from headquarters", "Owners of heavy machinery, lifts, or specialized gear", "Businesses that rent equipment in or out"],
    covers: ["Scheduled or blanket tools and machinery", "Equipment in transit", "Items at job sites or temporary locations", "Certain leased or borrowed equipment, when arranged"],
    example: "A trailer with a compact excavator is stolen from a job site over a weekend. If that machine was only listed on the building policy at the shop address, the claim can fail. Scheduled equipment coverage is what is built for that loss.",
    notes: ["Unscheduled miscellaneous tools often have a small sublimit. Expensive machines should be scheduled.", "This does not replace commercial auto for the truck that tows the equipment."],
  },
  {
    slug: "commercial-umbrella",
    name: "Commercial Umbrella / Excess",
    summary: "Additional limits above primary general liability, auto, and employer’s liability policies.",
    simple: "A commercial umbrella adds more liability limit on top of the policies you already have. When a bad claim blows through $1 million, this is the next layer.",
    details: "Many contracts, landlords, and project owners now ask for $2 million, $5 million, or more. Rather than raising every primary policy, businesses buy an umbrella or excess policy that sits above general liability, commercial auto, and employer’s liability. It is for the severe claim — a serious auto accident, a job-site injury to a third party, or a large property-damage event. We size the limit to the work, the contracts, and the balance sheet, not to a round number that sounds safe.",
    who: ["Contractors bidding jobs that require higher limits", "Property owners and growing operating companies", "Fleets with meaningful road exposure", "Anyone whose primary $1 million limit would not finish a serious claim"],
    covers: ["Liability above the underlying commercial policies", "Contractual limit requirements that exceed primary policies", "Severe third-party injury or damage claims", "Defense as described once the primary policy is exhausted"],
    example: "A company driver causes a highway accident with several injuries. The commercial auto policy pays its $1 million. The umbrella is designed to continue from there, up to its own limit.",
    notes: ["The umbrella only works if the underlying policies are in force at the required limits.", "Some contracts want a following-form excess policy. We match the form to the requirement."],
  },
  {
    slug: "cyber-liability",
    name: "Cyber Liability",
    summary: "Protection related to data breaches, ransomware, and other cyber incidents.",
    simple: "Cyber insurance helps when someone gets into your systems, locks your files, or steals customer information. It is not a computer repair plan. It is a claim-and-response policy for digital accidents.",
    details: "Even a small firm that emails invoices, stores client files in the cloud, or takes cards has a cyber exposure. A typical policy can help with the first-party costs — forensic IT, notifying customers, credit monitoring, ransom considerations, and lost income while systems are down — and with third-party claims if clients say their data was exposed. We look at how you back up data, whether you use multi-factor login, and what kind of information you actually hold. Carriers care about those details. So should you.",
    who: ["Professional firms that keep client files", "Retailers and offices that process payments", "Any business that uses email and cloud software", "Companies whose clients now require cyber limits in a contract"],
    covers: ["Breach response and investigation costs", "Business interruption from a covered cyber event", "Liability to customers after a data incident", "Ransomware-related costs, when the policy includes them"],
    example: "A ransomware attack freezes the office for four days and a client list is copied. Cyber coverage can help pay the response team, notification, and lost income. A BOP generally will not.",
    notes: ["A general liability or BOP policy is not a substitute for cyber.", "Poor backups and shared passwords make both the risk and the underwriting harder."],
  },
  {
    slug: "commercial-flood",
    name: "Flood Coverage (Commercial)",
    summary: "Flood protection for commercial buildings, contents, and related property.",
    simple: "Commercial property insurance almost never pays for flood. If water rises into the building from rain, a river, or surge, you need a separate flood policy.",
    details: "The exclusion is standard, which is why so many owners are surprised after a storm. Commercial flood can cover the building, the contents, or both, and it matters whether you own the real estate or are a tenant with inventory and equipment at grade. Mapped flood zones are only part of the story. Drainage failures, nearby creeks, and coastal surge have generated claims well outside “high risk” maps. We look at the address, first-floor occupancy, and whether contents or the shell is the bigger exposure.",
    who: ["Building owners near water or in mapped flood zones", "Tenants with inventory or equipment on a ground floor", "Investors whose lenders require flood coverage", "Owners who have never been in a flood zone but have drainage risk"],
    covers: ["The commercial building, if you insure it", "Contents and equipment, if purchased", "A gap that the regular property policy leaves open", "Locations inside and outside high-risk maps"],
    example: "A slow tropical system inundates a warehouse floor and ruins palletized stock. The property carrier points to the flood exclusion. Only a flood policy is built to pick that up.",
    notes: ["Waiting periods are common. Buy it before the forecast, not after.", "This is separate from sewer backup or sprinkler leakage, which are different water claims."],
  },
];

const lifeLines = [
  {
    slug: "term-life-insurance",
    name: "Term Life Insurance",
    kind: "life",
    image: "hero-home.jpg",
    summary: "A set death benefit for a set number of years — usually 10, 15, 20, or 30 — at a premium that is typically the lowest among life products.",
    simple: "Term life pays a lump sum to the people you name if you die during the term. If you outlive the term, the coverage ends unless you convert or renew it. There is usually no cash value.",
    details: "Term is the policy most families buy first because the job is simple: replace income, pay off a mortgage, or cover a defined obligation while the need is largest. You choose a face amount and a term. Premiums are typically level for that period. If you die while the policy is in force, the carrier pays the death benefit to your beneficiaries. When the term ends, you can often convert to a permanent policy without a new medical exam, renew at a much higher rate, or let it expire. Return-of-premium (ROP) term is a more expensive design that can give premiums back if you outlive the term. We quote standard cases and impaired-risk cases — health history is part of underwriting, not a reason to stay silent.",
    who: ["Parents who need income replacement while children are young", "Homeowners who want the mortgage paid if they die", "Anyone who needs a large death benefit at the lowest current premium", "People with a health history who still need a quote, not a brush-off"],
    covers: ["A death benefit paid to your beneficiaries if you die during the term", "Level premiums for the period you choose", "Conversion to permanent coverage, when the contract allows it", "Return-of-premium designs, when you want premiums back if you outlive the term"],
    example: "A 38-year-old with a 30-year mortgage and two children buys a 20-year, $1 million term policy. If they die in year 12, the beneficiaries receive the benefit. If they live past year 20, the policy ends unless it was converted.",
    notes: ["Term is not a savings account. If you need cash value or coverage that lasts a lifetime, look at whole life or universal life.", "We work cases that are not straightforward. Tell us the health history up front.", "Return-of-premium term costs more than standard term. We will show both."],
  },
  {
    slug: "whole-life-insurance",
    name: "Whole Life Insurance",
    kind: "life",
    image: "hero-home.jpg",
    summary: "Permanent coverage with guaranteed premiums, a guaranteed death benefit, and cash value that grows on a schedule set in the contract.",
    simple: "Whole life is built to last your entire life as long as you pay the premiums. Part of each premium funds the death benefit. Part builds cash value you can borrow against later.",
    details: "Unlike term, whole life does not expire at year 20. The contract guarantees the death benefit, the premium, and a minimum cash-value schedule if you keep the policy in force. Dividends, when declared, can buy paid-up additions, reduce premiums, or be taken in cash — they are not guaranteed. People use whole life for lifelong protection, estate liquidity, and a conservative cash-value component next to a term layer. It is the wrong tool if you only need coverage until the kids are grown and you want the cheapest premium. It is the right tool when the need does not have an end date, or when you want a policy that can still be there at 80. For estate and business succession, we coordinate with your attorney and CPA. We do not replace legal or tax advice.",
    who: ["People who want coverage that does not expire at a term date", "Families planning for estate liquidity or final expenses with a permanent policy", "Owners who want cash value they can access, subject to the contract", "Anyone building a base of permanent coverage under a larger term layer"],
    covers: ["A death benefit designed to stay in force for life, if premiums are paid", "Guaranteed cash value that grows on the policy schedule", "Policy loans and withdrawals, as the contract allows", "Dividend options, when the carrier declares a dividend"],
    example: "A 45-year-old buys a whole life policy to leave a tax-efficient death benefit and to have cash value in 20 years. Term would have been cheaper for 20 years and then gone. This policy is still there.",
    notes: ["Premiums are higher than term for the same face amount. That is the cost of a guarantee that does not expire.", "Loans and withdrawals reduce the death benefit if they are not repaid.", "Dividends are not guaranteed and are not a reason to buy the policy by themselves."],
  },
  {
    slug: "universal-life-insurance",
    name: "Universal Life Insurance",
    kind: "life",
    image: "hero-home.jpg",
    summary: "Flexible permanent life insurance — including guaranteed UL (GUL) and indexed UL (IUL) — with adjustable premiums and a cash-value account.",
    simple: "Universal life is permanent coverage with a flexible premium. You can often pay more, pay less, or skip a payment if the cash value can carry the cost of insurance. The tradeoff is that the policy has to be managed.",
    details: "There is more than one design. Traditional UL credits a declared interest rate. Guaranteed UL (GUL) is built mainly for a no-lapse death benefit to a stated age, with little emphasis on cash value. Indexed UL (IUL) credits interest using a formula tied to an index, with a cap, floor, and participation rate — it is not a direct investment in the market. Variable UL (VUL) uses separate accounts and can lose value; it requires a prospectus and is not the right first conversation for most households. We start with the job: lifelong death benefit at the lowest sustainable premium, cash-value accumulation, or a guarantee to a specific age. Then we match GUL, IUL, or another UL form. Large premium cases, older ages, and impaired-risk files are in appetite. Illustrations are hypothetical. We will walk the guaranteed column, not only the illustrated one.",
    who: ["People who want permanent coverage with more premium flexibility than whole life", "Buyers who need a no-lapse guarantee to a stated age (GUL)", "Clients considering indexed UL for accumulation plus a death benefit", "Business and estate cases that need a designed permanent policy"],
    covers: ["A death benefit that can last for life if the policy is funded as designed", "A cash-value account that earns a declared, guaranteed, or indexed credit", "Flexible premiums within the limits of the contract", "Riders such as overloan protection or a long-term care rider, when added"],
    example: "A 52-year-old wants a $1 million death benefit to age 121 and does not care about cash value. A GUL priced to the no-lapse guarantee is usually the cleaner fit than an IUL illustrated at a high cap.",
    notes: ["IUL is not a stock market investment. Caps, floors, and participation rates can change.", "Underfunded UL is how policies lapse. We review funding, not only the year-1 premium.", "Variable UL involves market risk and a prospectus. Ask whether it is even available for your situation."],
  },
  {
    slug: "final-expense-insurance",
    name: "Final Expense Insurance",
    kind: "life",
    image: "hero-home.jpg",
    summary: "A smaller whole-life policy designed to pay funeral costs, medical bills, and other last expenses — often with simplified underwriting.",
    simple: "Final expense is life insurance sized for burial, a funeral, and leftover bills. Face amounts are smaller than a typical term policy, and the application is usually shorter.",
    details: "The point is not income replacement. It is so your family is not writing checks for a funeral, a hospital balance, or a small remaining debt while they are also grieving. These policies are typically whole life, so they do not expire at year 10. Many use simplified issue or graded death benefits, which means the full face amount may not pay in the first two years if death is from natural causes — the contract says so in plain language, and we will too. Final expense is a fit for older applicants, people who were declined for larger coverage, or anyone who wants a modest permanent benefit without a full medical exam. It is not a substitute for a $1 million term policy if the household still needs income replacement.",
    who: ["People who want funeral and last-expense costs covered", "Older applicants who want a modest permanent benefit", "Anyone who was declined for a larger medically underwritten policy", "Families who do not want relatives paying out of pocket at the worst time"],
    covers: ["A death benefit sized for funeral, burial, and related bills", "Permanent coverage that does not expire at a term date", "Simplified or graded issue, when the health history calls for it", "A policy that can be assigned to a funeral home, if you choose"],
    example: "A 68-year-old buys a $15,000 final expense policy so children are not splitting a funeral bill. It will not replace her pension. It will pay the costs that come due in the first weeks.",
    notes: ["Read the graded-benefit period. A two-year wait on natural-cause death is common on simplified issue.", "This is not income-replacement term. If the household still depends on your paycheck, start with term.", "We will not oversell a $50,000 policy when a $15,000 policy is the actual need."],
  },
  {
    slug: "business-life-insurance",
    name: "Business Life Insurance",
    kind: "life",
    image: "hero-commercial.jpg",
    summary: "Key-person coverage and buy-sell funding so a death does not leave the company, the bank, or the surviving owners without a plan.",
    simple: "If a partner or key employee dies, the business still has payroll, debt, and customers. Business life insurance is the cash that lets the remaining owners keep operating — or buy out the estate — without a fire sale.",
    details: "Two designs do most of the work. Key-person insurance is owned by the company on someone whose death would hurt revenue, credit, or operations. The benefit gives the firm time and cash. Buy-sell insurance funds an agreement that says how ownership transfers when an owner dies (and often at disability or retirement). Term can fund a loan or a short remaining obligation. Permanent coverage is more common when the buy-sell is meant to last. We also look at larger premium and estate-planning cases — including when the death benefit is meant for estate liquidity rather than operations. The legal documents are not the policy. We work next to your attorney and CPA so the insured, the owner, and the beneficiary match the agreement. We do not draft the buy-sell ourselves.",
    who: ["Partners who have a buy-sell agreement, or need one funded", "Companies that would stall if a rainmaker, operator, or founder died", "Owners whose bank or investor expects key-person coverage on a loan", "Closely held firms planning for estate liquidity or succession"],
    covers: ["Key-person death benefit payable to the company", "Funding for a buy-sell so the estate can be paid and the firm can continue", "Term or permanent designs matched to how long the need lasts", "Coordination with loans, estate plans, and ownership documents"],
    example: "Two partners each own 50%. They agree the survivor will buy the deceased’s shares. Policies on each life, owned as the agreement requires, are what produce the cash at the worst moment — instead of a conversation with the widow and the bank at the same time.",
    notes: ["An unfunded buy-sell is a letter of intent, not a plan.", "The owner, insured, and beneficiary have to match the agreement or you create a tax and title mess.", "This is insurance, not legal or tax advice. Bring the attorney into the same conversation."],
  },
  {
    slug: "fixed-annuities",
    name: "Fixed Annuities",
    kind: "annuity",
    image: "hero-city.jpg",
    summary: "Insurance contracts that credit a declared rate — including multi-year guaranteed annuities (MYGAs) — for principal protection and tax-deferred growth.",
    simple: "A fixed annuity is a contract with an insurance company. You give them a premium. They credit a stated interest rate for a period. Your principal is not supposed to move with the stock market.",
    details: "A declared-rate fixed annuity credits interest set by the carrier. A MYGA (multi-year guaranteed annuity) locks a rate for a set term, often 3, 5, or 7 years, then you can renew, withdraw, or move the value, subject to surrender charges and tax rules. These are insurance products, not bank CDs. They are not FDIC insured. Guarantees depend on the claims-paying ability of the issuing insurer. People use them when they want a known rate, tax deferral, and less market path-risk than a brokerage account — and they can live with limited liquidity during the surrender period. We look at the rate, the term, free-withdrawal provisions, and what happens at the end of the guarantee. We will not treat a MYGA as a checking account.",
    who: ["People who want a stated rate without stock-market path risk", "Retirees and pre-retirees parking a portion of savings for a defined term", "Anyone comparing a MYGA to leaving cash in a low-yield account", "Owners rolling a CD-like need into a tax-deferred insurance contract"],
    covers: ["A credited rate declared by the insurer, or guaranteed for a multi-year term", "Tax-deferred growth while the money stays in the contract", "Principal protection from market decline, subject to the insurer’s strength", "Limited penalty-free withdrawals, as the contract allows"],
    example: "A 62-year-old does not need $200,000 for five years and does not want it in equities. A 5-year MYGA credits a guaranteed rate. If they need the whole sum in year two, surrender charges likely apply.",
    notes: ["Not FDIC insured. The guarantee is only as strong as the issuing carrier.", "Surrender charges and tax on gains apply if you pull money early. This is not a savings account.", "We do not pick a MYGA only because the year-1 rate is the highest quote on a sheet."],
  },
  {
    slug: "indexed-annuities",
    name: "Indexed Annuities",
    kind: "annuity",
    image: "hero-city.jpg",
    summary: "Fixed indexed annuities that credit interest using a market-index formula — with a floor that is typically zero — rather than putting your premium directly in stocks.",
    simple: "An indexed annuity does not buy the S&P 500. It uses an index to calculate an interest credit, usually with a cap, a participation rate, and a floor. In a down year you typically earn nothing for that period — you are not supposed to lose premium to the market.",
    details: "Fixed indexed annuities (FIAs) sit between a declared-rate annuity and a market account. Your premium stays with the insurer. Credits are based on an index formula the carrier controls. Caps, spreads, and participation rates can change. That is why we read the contract, not the illustration. Some contracts add a lifetime-income rider for a fee. That rider is a separate decision from the accumulation story. Indexed annuities are insurance products, not securities. They are not FDIC insured. They have surrender charges and limited liquidity. They are a fit when you want some link to index performance, a floor against market loss of principal, and you can leave the money for the term. They are a poor fit if you need the money next year or you want uncapped equity returns.",
    who: ["Pre-retirees who want a floor under a portion of savings", "People who will not sleep if the account can fall 20%", "Clients considering a lifetime-income rider in addition to accumulation", "Anyone who was shown only the illustrated cap and wants the real contract terms"],
    covers: ["Interest credits tied to an index formula, not direct stock ownership", "A floor that is typically 0% for the crediting period", "Optional lifetime-income riders, when you add them and pay for them", "Tax-deferred growth while funds remain in the contract"],
    example: "A 58-year-old moves a portion of savings into an FIA with a 0% floor. In a strong index year the credit is capped. In a down year that slice does not take the market loss. The rest of the portfolio can stay invested elsewhere.",
    notes: ["Caps and participation rates are not guaranteed at today’s levels for the life of the contract.", "An income rider has a cost. The rider value is not the same as the cash-surrender value.", "This is not a variable annuity and not a mutual fund. Do not buy it as one."],
  },
  {
    slug: "income-annuities",
    name: "Income Annuities",
    kind: "annuity",
    image: "hero-city.jpg",
    summary: "SPIAs and DIAs that turn a lump sum into a paycheck — starting now, or starting later — for a period of years or for life.",
    simple: "An income annuity is how you convert savings into a stream of checks. A SPIA starts almost immediately. A DIA (deferred income annuity) starts on a future date you choose, often as longevity insurance.",
    details: "A single-premium immediate annuity (SPIA) is funded with a lump sum and begins payments within a year, often within a month. You choose life-only, life with cash refund, joint life, or a period certain. A deferred income annuity (DIA) is purchased now so payments start at a later age — a way to cover the risk of living past 85 without managing a drawdown yourself. Once you annuitize, you generally cannot get the lump sum back. That is the point and the trade. These contracts are for people who value a check they cannot outlive more than they value remaining control of the principal. We quote the payout, the payment option, and what happens if you die early. We will not put money you may need for a house or a health shock into a SPIA.",
    who: ["Retirees who want a paycheck they cannot outlive", "People covering essential expenses with guaranteed income and investing the rest", "Buyers of a DIA as longevity insurance starting at a later age", "Surviving spouses who want a simple, defined income stream"],
    covers: ["A contractual income stream starting now (SPIA) or later (DIA)", "Life-only, joint-life, cash-refund, and period-certain options", "Payments that do not depend on this year’s market return", "A defined amount you can plan household bills around"],
    example: "A 70-year-old uses part of a rollover to buy a SPIA that covers housing and groceries for life. The remaining portfolio stays invested. A DIA purchased at 60 to start at 80 is a different job: insurance against living a very long time.",
    notes: ["Annuitization is usually irreversible. Do not fund it with money you might need as a lump sum.", "Inflation can erode a level payment. Ask about increasing options and what they cost in starting income.", "Guarantees depend on the issuing insurer, not on the stock market and not on FDIC insurance."],
  },
  {
    slug: "disability-insurance",
    name: "Disability Insurance",
    kind: "disability",
    image: "hero-home.jpg",
    summary: "Short-term and long-term disability coverage that replaces a portion of income if you cannot work because of illness or injury.",
    simple: "Life insurance pays if you die. Disability insurance pays if you are alive and cannot work. For many people in their 30s and 40s, that is the larger financial risk.",
    details: "Short-term disability (STD) covers a weeks-to-months gap, often until long-term disability starts. Long-term disability (LTD) is the policy that can pay for years — sometimes to retirement age — if you meet the definition of disability. Own-occupation versus any-occupation language is the clause that decides claims. Benefit amount, elimination period, and whether the policy is individual or group all change the outcome. Employer group LTD is a start. It is often capped, taxable if the employer paid the premium, and not portable if you leave. We quote individual disability for professionals and owners who cannot live on the group benefit, and we look at business overhead or disability buy-out when a firm would stall if an owner could not work.",
    who: ["Professionals and owners whose income stops if they cannot work", "Employees whose group LTD is too small, too short, or not portable", "Households that could not keep the mortgage on one income through a long illness", "Partners who need a disability trigger inside a buy-sell"],
    covers: ["A monthly benefit if you meet the policy’s definition of disability", "Short-term coverage for a brief gap, long-term coverage for an extended one", "Own-occupation definitions, when the contract includes them", "Optional riders such as residual or cost-of-living, when added"],
    example: "A surgeon injures a hand and cannot operate for 18 months. Own-occupation LTD is designed to pay even if they could work in another job. A weak any-occupation definition might not.",
    notes: ["Group LTD from work is not the same as an individual policy. Read the definition, the cap, and the tax treatment.", "Waiting periods and pre-existing-condition rules apply. Buy this while you are healthy.", "This is not workers’ compensation. Workers’ comp is for on-the-job injuries; disability is broader."],
  },
  {
    slug: "long-term-care-insurance",
    name: "Long-Term Care Insurance",
    kind: "ltc",
    image: "hero-home.jpg",
    summary: "Traditional LTC, linked-benefit policies, and life insurance with an LTC rider — coverage for care at home or in a facility when you cannot perform daily activities.",
    simple: "Health insurance and Medicare do not pay for years of help bathing, dressing, or living with cognitive decline. Long-term care coverage is the policy built for that cost.",
    details: "Traditional long-term care insurance pays a daily or monthly benefit when you cannot perform a set number of activities of daily living, or when you have a severe cognitive impairment. Linked-benefit (hybrid) policies combine life insurance or an annuity with long-term care: if you never need care, a death benefit remains. A life policy with an LTC rider accelerates or adds benefits for care. Each design trades premium, flexibility, and what happens if you never file a care claim. We start with how you would actually pay for care — savings, family, a traditional policy, or a hybrid — then quote the form that matches. This is not a nursing-home-only product anymore. Home care is often the first use.",
    who: ["People who do not want care costs to land on a spouse or children", "Households with assets to protect but not enough to self-fund a long claim", "Buyers who want a hybrid so unused benefits become a death benefit", "Anyone whose parents’ care already showed what the bill looks like"],
    covers: ["Benefits for qualifying home care, assisted living, or facility care", "Traditional reimbursement or indemnity designs", "Linked-benefit life or annuity contracts that keep a death benefit if care is never used", "Life insurance with an LTC rider, when that is the cleaner structure"],
    example: "A 58-year-old couple does not want a $9,000 monthly care bill to spend down what they meant to leave. A linked-benefit policy pays if care is needed; if it is not, the children still receive a death benefit.",
    notes: ["Medicare does not pay for custodial long-term care. That surprise is expensive.", "Underwriting gets harder with age and health. Waiting until a diagnosis is usually too late.", "Hybrids cost more than term life. You are buying two jobs in one contract."],
  },
];

const annuityLines = lifeLines.filter((item) => item.kind === "annuity");
const lifeProducts = lifeLines.filter((item) => item.kind !== "annuity");

const loanProducts = [
  {
    slug: "working-capital",
    name: "Working Capital / Short-Term Financing",
    summary: "Flexible funding to support day-to-day operations and cash flow needs.",
    simple: "Working capital is money to run the business this month — payroll, inventory, suppliers — not money to buy a building. It is short-term fuel for cash-flow gaps.",
    details: "Most businesses do not get paid the same day they spend. You buy inventory in March, pay staff every two weeks, and collect from customers in April or May. Working capital and other short-term facilities exist to cover that gap. They are a poor fit for buying real estate or making a 10-year bet. They are a good fit for a seasonal build, a large purchase order, or a stretch of slow collections. We look at revenue, bank statements, and what the money will actually be used for, then match the term to the need instead of putting a long loan on a short problem.",
    who: ["Owners with lumpy or seasonal sales", "Companies waiting on customer invoices", "Businesses stocking up before a busy season", "Operators who need payroll or supplier coverage without selling equity"],
    covers: ["Payroll and operating expenses", "Inventory and supplier payments", "Short-term cash-flow gaps", "A defined, near-term use of funds"],
    example: "A landscaper’s best months are April through September, but insurance, equipment repairs, and crew hiring hit in February. A short-term facility can carry those costs until invoices start coming in.",
    notes: ["This is not a substitute for a commercial real estate loan.", "The cleanest files show exactly where the money goes and how it comes back."],
  },
  {
    slug: "equipment-financing",
    name: "Equipment Financing",
    summary: "Financing for machinery, vehicles, and business equipment.",
    simple: "Equipment financing lets you buy the machine, truck, or system you need and pay for it over time, instead of writing a check for the full price today.",
    details: "The equipment itself is usually the collateral. That is why this product often works when a blank unsecured loan would not. Terms are built around how long the asset will be useful — a work truck and a CNC machine are not amortized the same way. You can finance a purchase or, in some cases, refinance equipment you already own to pull cash back out. Down payment, time in business, and the strength of operations all matter. The goal is to keep working cash in the bank while the asset starts earning.",
    who: ["Contractors buying trucks, lifts, or tools", "Manufacturers and shops adding machinery", "Medical, restaurant, and service businesses replacing equipment", "Owners who would rather not drain cash for a long-lived asset"],
    covers: ["New or used business equipment", "Work vehicles used in the operation", "Selected refinances of equipment you already own", "Terms that follow the life of the asset"],
    example: "A shop needs a $80,000 machine that will last a decade. Financing it over several years keeps cash available for payroll and materials while the machine pays for itself in jobs.",
    notes: ["Soft costs, installation, and training are not always financeable. We separate those up front.", "The asset should outlast the loan. That is the simple test."],
  },
  {
    slug: "asset-based-lending",
    name: "Asset-Based Lending (ABL)",
    summary: "Loans secured by business assets such as accounts receivable and inventory.",
    simple: "Asset-based lending is a loan backed by what the business already owns and is owed — usually unpaid customer invoices and inventory — rather than by last year’s profit alone.",
    details: "If your company is growing fast, coming through a rough patch, or holding a lot of value in receivables and stock, a traditional cash-flow loan can say no even when the balance sheet is solid. ABL turns those assets into a borrowing base. You can typically borrow a percentage of eligible receivables and a smaller percentage of eligible inventory. Reporting is tighter than a simple term loan — agings and inventory certificates are normal — because the lender is underwriting the assets as they turn. That extra work is the trade for more capacity.",
    who: ["Wholesalers, distributors, and manufacturers", "Companies whose invoices or inventory are the real story", "Businesses growing faster than a bank line will allow", "Operators in a turnaround who still have collectible receivables"],
    covers: ["A revolving or term facility tied to A/R and inventory", "Growth, seasonal builds, and selected turnarounds", "Borrowing capacity that can rise as assets rise", "A structure based on the conversion cycle, not only on EBITDA"],
    example: "A distributor lands a big retail account. Receivables jump from $400,000 to $900,000. An ABL line can increase with those invoices, instead of capping you at last year’s cash-flow number.",
    notes: ["Ineligible invoices (very old, related-party, disputed) do not count. We review the aging honestly.", "This is more reporting than a simple loan. It is also more flexible when assets are the strength."],
  },
  {
    slug: "business-lines-of-credit",
    name: "Business Lines of Credit",
    summary: "Revolving credit facilities for ongoing business needs.",
    simple: "A line of credit is a reusable pool of money. You draw what you need, pay it back, and draw again — like a business credit card, but usually cheaper and built for larger, repeating needs.",
    details: "Unlike a term loan, you do not take the full amount on day one and start a fixed payoff. Interest is typically charged on what you have outstanding. That makes a line the right tool for inventory buys, waiting on receivables, or covering a slow month without opening a new loan every time. It may be secured by receivables, a blanket filing, or other collateral, depending on the profile. We size it to a realistic peak need, not to the largest number someone will quote.",
    who: ["Businesses with repeating, uneven cash needs", "Owners who are tired of one-off short-term loans", "Companies that want a standby facility before they need it", "Operators managing inventory and receivables in a cycle"],
    covers: ["Revolving access up to an approved limit", "Draws for operations, inventory, and timing gaps", "Repayment and re-borrowing as cash comes in", "A facility that stays in place until it is renewed or called"],
    example: "You draw $40,000 to take a supplier discount, collect from customers three weeks later, pay the line down, and it is ready for the next cycle. A term loan cannot do that without a new closing.",
    notes: ["A line is not free money. Unused fees and cleanup provisions exist on some facilities.", "If the need is a one-time purchase, a term loan is usually cleaner."],
  },
  {
    slug: "unsecured-term-loans",
    name: "Unsecured Term Loans",
    summary: "Term financing options for qualified businesses.",
    simple: "An unsecured term loan is a lump sum you receive now and pay back on a schedule. You are not pledging a specific building or machine — the decision is based mainly on how the business performs.",
    details: "These loans are for qualified companies with a track record: revenue, time in business, and bank activity that support repayment. Because there is no single hard asset standing behind the note, the credit box is tighter and the term is often shorter than a mortgage. Uses can include expansion, working needs, partner buyouts, or consolidating higher-cost debt. We are straightforward about whether the file is a fit. If the better answer is a secured or SBA structure, we say so.",
    who: ["Established businesses with clean banking history", "Owners who need a defined amount, not a revolving line", "Companies funding growth or a buyout without pledging real estate", "Borrowers who qualify on performance rather than on collateral"],
    covers: ["A single advance with scheduled payments", "Growth, working needs, or selected buyouts", "A structure based on business performance", "A known payoff date"],
    example: "Two partners want to buy out a third. The company has strong deposits and several years of returns, but does not want to mortgage the building. An unsecured term loan, if the credit supports it, can fund that buyout.",
    notes: ["“Unsecured” does not mean “no underwriting.” Personal guarantees are still common.", "If the amount is large or the story is thin, a secured or SBA path is often healthier."],
  },
  {
    slug: "commercial-real-estate",
    name: "Commercial Real Estate Loans",
    summary: "Financing for multi-family, office, retail, industrial, hotels, self-storage, and other commercial properties.",
    simple: "A commercial real estate loan is a mortgage on a business property — apartments, a warehouse, a storefront, an office, a hotel, or self-storage — used to buy it, refinance it, or pull equity out.",
    details: "The property’s income and the borrower’s experience drive the deal as much as the purchase price. Lenders look at rent rolls or operating statements, occupancy, sponsorship, and how much cash you are putting in. We work across the main property types: multi-family, office, retail, industrial, hotels, self-storage, and selected special-purpose assets. Requests can be an acquisition, a refinance of a maturing loan, or a recapitalization. Owner-users (you occupy the building) and investors (tenants pay the rent) are both in scope, and the structure is not the same for each.",
    who: ["Investors buying or refinancing income property", "Business owners purchasing the building they occupy", "Sponsors with a 2026 or 2027 maturity to solve", "Owners of multi-family, industrial, retail, office, hotel, or storage assets"],
    covers: ["Purchase money for commercial property", "Refinance and recapitalization", "Multiple major property types", "A loan sized to the asset and the capital stack"],
    example: "You are buying a small industrial building for your operating company. A CRE loan, or an SBA 504 if you qualify, can finance the real estate so operating cash stays in the business.",
    notes: ["This is not a residential mortgage, even if the property has apartments. Different rules, different documents.", "Start well before a maturity date. CRE closings are not 30-day consumer loans."],
  },
  {
    slug: "bridge-financing",
    name: "Bridge Financing",
    summary: "Short-term financing solutions to bridge gaps between transactions.",
    simple: "Bridge financing is a short-term loan that gets you from here to there — through a purchase, a renovation, or the months before a permanent loan is ready.",
    details: "Permanent commercial debt wants a stable story: leased, performing, clean title, long runway. Real deals are often messy in the middle. A bridge loan is meant for that middle. It can close an acquisition quickly, fund a value-add plan, or replace a loan that is coming due while you finish leasing or wait on take-out financing. The term is short on purpose. The exit — sale, refinance, or stabilization — has to be believable on day one. We will not put a bridge on a property that has no path off of it.",
    who: ["Buyers who need to close before permanent debt is ready", "Owners executing a renovation or lease-up", "Sponsors facing a maturity with a clear refinance plan", "Investors who need speed more than a 10-year term"],
    covers: ["Short-duration capital between two events", "Acquisitions and value-add plans", "A gap until take-out or sale", "A defined exit, not an open-ended hold"],
    example: "You win a building at auction in 30 days. The permanent lender needs 90. A bridge can close the purchase; the permanent loan takes you out when underwriting is done.",
    notes: ["Bridge money is more expensive than permanent debt. That is the price of speed and flexibility.", "If you cannot explain the exit in one sentence, it is not a bridge — it is a problem."],
  },
  {
    slug: "construction-development",
    name: "Construction & Development Financing",
    summary: "Funding for commercial construction and development projects.",
    simple: "Construction financing pays for the project as it is built. You do not get the full loan in one deposit. You draw money when the work is done and inspected.",
    details: "Ground-up buildings, major renovations, and some land or subdivision plans use this structure. The file needs a budget, plans, a contractor story, contingencies, and a plan for what happens when the building is finished — refinance into permanent debt, sell, or occupy. Interest is typically charged on the amount drawn, not always on the full commitment from day one. We review whether the numbers work if costs run long or lease-up is slower than the pro forma. Hope is not a draw schedule.",
    who: ["Developers and owner-users building or substantially renovating", "Sponsors with plans, a budget, and a general contractor", "Projects that will become income property or an owner-occupied building", "Borrowers who already know how the loan will be taken out"],
    covers: ["Ground-up commercial construction", "Major renovations", "Draws tied to completed work", "A path to permanent financing or sale"],
    example: "You are converting a vacant retail box into three tenant suites. Construction financing funds demolition and build-out in stages. When the tenants are in, a permanent CRE loan pays off the construction facility.",
    notes: ["Soft costs, interest reserve, and contingency have to be in the budget. Leaving them out is how projects stall.", "This is not a working-capital loan with a hard-hat photo."],
  },
  {
    slug: "sba-loans",
    name: "SBA Loans",
    summary: "Government-backed financing options for small businesses.",
    simple: "SBA loans are regular business loans with a government guarantee behind part of them. That guarantee is what helps qualified small businesses get longer terms or lower down payments than they might get on a conventional loan.",
    details: "The two workhorses are 7(a) and 504. 7(a) is the flexible one — working capital, equipment, certain acquisitions, and some real estate. 504 is the real-estate and long-life-equipment program for owner-occupied buildings, often with a small down payment and a long amortization. You still have to qualify. The SBA does not hand out grants here. We walk through eligibility, use of proceeds, occupancy rules, and the paperwork so you are not surprised at credit. If SBA is the wrong tool, we say so and look at a conventional structure.",
    who: ["Small businesses buying the building they will occupy", "Owners financing equipment or an acquisition", "Companies that need longer terms than a conventional short loan", "Borrowers who can document the business and the use of funds"],
    covers: ["Owner-occupied real estate (especially 504)", "Equipment and working capital (especially 7(a))", "Selected business acquisitions", "Government-backed terms for eligible small businesses"],
    example: "A medical practice wants to buy its office building instead of renting. An SBA 504 structure can finance most of the purchase, keep the down payment manageable, and leave working capital in the practice.",
    notes: ["Owner-occupancy rules are real. You generally cannot use 504 to buy a purely investment building.", "Documentation is heavier than a simple term loan. Completeness speeds the file more than anything else."],
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function logoImg(root, variant = "default") {
  const file = variant === "light" ? "assets/brand/logo-light.png?v=3" : "assets/brand/logo.png?v=3";
  const cls = variant === "light" ? "logo-img logo-img-light" : "logo-img";
  return `<img class="${cls}" src="${root}${file}" alt="Wellesley Collective" width="196" height="78" decoding="async">`;
}

function photo({ src, alt, root = "", lazy = true, priority = false, className = "" }) {
  const attrs = [
    className ? `class="${className}"` : "",
    `src="${root}${src}"`,
    `alt="${esc(alt)}"`,
    lazy ? `loading="lazy" decoding="async"` : `decoding="async"`,
    priority ? `fetchpriority="high"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<img ${attrs}>`;
}

function figurePhoto({ src, alt, caption, root = "", lazy = true }) {
  return `<figure class="photo-frame">
    ${photo({ src, alt, root, lazy })}
    ${caption ? `<figcaption>${esc(caption)}</figcaption>` : ""}
  </figure>`;
}

const FIRM_EMAIL = "rasheed@wellesleycollective.com";
const FIRM_PHONE = "239-350-5227";
const FIRM_TEL = "+12393505227";
const CALENDLY_URL = "https://calendly.com/rasheed-wellesleycollective/30min";
const STRIFE_KEY = "YYCdK-ApEWu_fth9";
const ZOHO_FORM_HTML = fs.readFileSync(path.join(rootDir, "partials", "zoho-lead-form.html"), "utf8");

function isSelfQuote(item) {
  return Boolean(item && item.kind && item.kind !== "annuity");
}

function intakePath(item) {
  if (!item) return "";
  if (personalLines.some((line) => line.slug === item.slug)) return "intake/personal.html";
  if (commercialLines.some((line) => line.slug === item.slug)) return "intake/commercial.html";
  return "";
}

function quoteApplyEmbed() {
  return `
    <div class="quote-apply">
      <div id="life-quote-widget" class="quote-apply-frame"></div>
      <script id="strife" src="https://cdn.quoteandapply.io/widget.js" data-strife-key="${STRIFE_KEY}" data-strife-container-id="life-quote-widget"></script>
      <p class="disclaimer mt-24">Quotes and applications are subject to underwriting and do not bind coverage. You can finish online or stop and talk with us first.</p>
    </div>`;
}

function zohoForm() {
  return `<div class="zoho-embed">${ZOHO_FORM_HTML}</div>`;
}

function calendlyBlock() {
  return `
    <div class="calendly-block">
      <p class="kicker">Intro call</p>
      <h2>Book a 30-minute call.</h2>
      <p class="subhead">No account required. Pick a time that works.</p>
      <a class="btn btn-gold" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
      <div class="calendly-inline-widget" data-url="${CALENDLY_URL}" style="min-width:320px;height:700px;"></div>
      <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
    </div>`;
}

function header(root, current) {
  const r = root;
  const active = (id) => (current === id ? " is-active" : "");
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="topbar">
    <div class="container topbar-inner">
      <span>Insurance · Financial Services · Commercial Financing</span>
      <span class="topbar-contact">
        <a href="tel:${FIRM_TEL}">${FIRM_PHONE}</a>
        <a href="mailto:${FIRM_EMAIL}">${FIRM_EMAIL}</a>
      </span>
    </div>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="${r}index.html" aria-label="Wellesley Collective home">
        ${logoImg(r)}
      </a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav" aria-label="Primary">
        <a class="nav-link${active("home")}" href="${r}index.html">Home</a>
        <div class="nav-item">
          <a class="nav-btn${active("insurance")}" href="${r}insurance/index.html">
            Insurance
            <svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </a>
          <div class="dropdown dropdown-wide dropdown-3">
            <div>
              <p class="dropdown-label">Personal Lines</p>
              <a href="${r}intake/personal.html"><strong>Start a personal quote</strong></a>
              <a href="${r}insurance/index.html#personal">View all personal lines</a>
              ${personalLines.map((item) => `<a href="${r}insurance/${item.slug}.html">${esc(item.name)}</a>`).join("")}
            </div>
            <div>
              <p class="dropdown-label">Commercial Lines</p>
              <a href="${r}intake/commercial.html"><strong>Start a commercial quote</strong></a>
              <a href="${r}insurance/index.html#commercial">View all commercial lines</a>
              ${commercialLines.map((item) => `<a href="${r}insurance/${item.slug}.html">${esc(item.name)}</a>`).join("")}
            </div>
            <div>
              <p class="dropdown-label">Life Insurance</p>
              <a href="${r}insurance/quote.html"><strong>Get a life insurance quote</strong></a>
              <a href="${r}insurance/index.html#life">View all life insurance</a>
              ${lifeProducts.map((item) => `<a href="${r}insurance/${item.slug}.html">${esc(item.name)}</a>`).join("")}
            </div>
          </div>
        </div>
        <div class="nav-item">
          <a class="nav-btn${active("financial")}" href="${r}financial-services/index.html">
            Financial Services
            <svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </a>
          <div class="dropdown">
            <p class="dropdown-label">Annuities</p>
            <a href="${r}financial-services/index.html"><strong>View all annuities</strong></a>
            ${annuityLines.map((item) => `<a href="${r}financial-services/${item.slug}.html">${esc(item.name)}</a>`).join("")}
          </div>
        </div>
        <div class="nav-item">
          <a class="nav-btn${active("loans")}" href="${r}commercial-loans/index.html">
            Commercial Financing
            <svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </a>
          <div class="dropdown dropdown-wide">
            <div>
              <p class="dropdown-label">Operating Capital</p>
              <a href="${r}commercial-loans/index.html"><strong>View all commercial financing</strong></a>
              ${loanProducts.slice(0, 5).map((item) => `<a href="${r}commercial-loans/${item.slug}.html">${esc(item.name)}</a>`).join("")}
            </div>
            <div>
              <p class="dropdown-label">Property &amp; Programs</p>
              ${loanProducts.slice(5).map((item) => `<a href="${r}commercial-loans/${item.slug}.html">${esc(item.name)}</a>`).join("")}
            </div>
          </div>
        </div>
        <a class="nav-link${active("rates")}" href="${r}rates.html">Rates</a>
        <div class="nav-item">
          <a class="nav-btn${active("resources")}" href="${r}resources/index.html">
            Resources
            <svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.4"/></svg>
          </a>
          <div class="dropdown dropdown-wide dropdown-3 dropdown-end">
            <div>
              <p class="dropdown-label">Property &amp; vehicles</p>
              <a href="${r}resources/index.html"><strong>All tools</strong></a>
              <a href="${r}resources/index.html#flood">Flood zone lookup</a>
              <a href="${r}resources/index.html#risk">Property risk checker</a>
              <a href="${r}resources/index.html#vin">VIN decoder</a>
            </div>
            <div>
              <p class="dropdown-label">Business &amp; capital</p>
              <a href="${r}resources/index.html#entity">Entity lookup</a>
              <a href="${r}resources/index.html#dscr">DSCR calculator</a>
              <a href="${r}resources/index.html#sba">SBA snapshot</a>
            </div>
            <div>
              <p class="dropdown-label">Life &amp; money</p>
              <a href="${r}resources/index.html#longevity">Longevity &amp; income gap</a>
              <a href="${r}resources/index.html#inflation">Inflation calculator</a>
            </div>
          </div>
        </div>
        <a class="nav-link${active("blog")}" href="${r}blog/index.html">Blog</a>
        <a class="nav-link${active("about")}" href="${r}about.html">About</a>
        <a class="nav-link${active("contact")}" href="${r}contact.html">Contact</a>
      </nav>
      <a class="btn btn-gold header-cta" href="${r}get-started.html">Get Started</a>
    </div>
  </header>`;
}

function footer(root) {
  const r = root;
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="${r}index.html">
            ${logoImg(r, "light")}
          </a>
          <p>Insurance, financial services, and commercial financing — together in one place.</p>
        </div>
        <div>
          <h4>Services</h4>
          <a href="${r}insurance/index.html">Insurance</a>
          <a href="${r}insurance/index.html#life">Life insurance</a>
          <a href="${r}insurance/quote.html">Life insurance quote</a>
          <a href="${r}intake/personal.html">Personal quote intake</a>
          <a href="${r}intake/commercial.html">Commercial quote intake</a>
          <a href="${r}financial-services/index.html">Financial Services</a>
          <a href="${r}commercial-loans/index.html">Commercial Financing</a>
          <a href="${r}rates.html">Market rates</a>
          <a href="${r}resources/index.html">Resource Center</a>
          <a href="${r}get-started.html">Get Started</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="${r}about.html">About</a>
          <a href="${r}blog/index.html">Blog</a>
          <a href="${r}contact.html">Contact</a>
          <a href="${r}privacy.html">Privacy Policy</a>
          <a href="${r}terms.html">Terms of Use</a>
        </div>
        <div>
          <h4>Contact</h4>
          <a href="tel:${FIRM_TEL}">${FIRM_PHONE}</a>
          <a href="mailto:${FIRM_EMAIL}">${FIRM_EMAIL}</a>
          <a href="https://calendly.com/rasheed-wellesleycollective/30min" target="_blank" rel="noopener">Book a call</a>
          <a href="${r}get-started.html">Get Started</a>
          <a href="${r}contact.html">Contact Us</a>
        </div>
      </div>
      <div class="footer-legal">
        <p>© ${new Date().getFullYear()} Wellesley Collective. All rights reserved.</p>
        <p>Insurance · Financial Services · Commercial Financing</p>
      </div>
    </div>
  </footer>`;
}

const SITE = "https://wellesleycollective.com";

function redirectPage(to) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${to}">
  <title>Wellesley Collective</title>
  <script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head>
<body>
  <p><a href="${to}">Continue to Wellesley Collective</a></p>
</body>
</html>
`;
}

function checkboxes(name, items) {
  return `<div class="check-grid">${items
    .map((item) => {
      const value = typeof item === "string" ? item : item.name;
      const slug = typeof item === "string" ? "" : item.slug;
      return `<label class="check"><input type="checkbox" name="${name}" value="${esc(value)}"${slug ? ` data-slug="${esc(slug)}"` : ""}><span>${esc(value)}</span></label>`;
    })
    .join("")}</div>`;
}

function startLineOptions(items, href, extras = []) {
  const extraHtml = extras
    .map((row) => `<option value="${esc(row.value)}" data-href="${row.href}">${esc(row.label)}</option>`)
    .join("");
  const blank = extras.length ? extraHtml : `<option value="" data-href="${href}">Not sure / more than one</option>`;
  return (
    blank +
    items
      .map((item) => {
        const dest = typeof item.startHref === "string" ? item.startHref : href;
        return `<option value="${esc(item.name)}" data-slug="${esc(item.slug)}" data-href="${dest}">${esc(item.name)}</option>`;
      })
      .join("")
  );
}

function toolBlock({ id, kicker, title, subhead, fields, note, button, cream }) {
  return `
    <section class="section${cream ? " section-cream" : ""}" id="${id}">
      <div class="container tool-layout">
        <div>
          <p class="kicker">${kicker}</p>
          <h2>${title}</h2>
          <p class="subhead">${subhead}</p>
          <form class="form tool-form" id="${id}-form">
            ${fields}
            <p class="form-note" id="${id}-status">${note}</p>
            <button class="btn btn-gold" type="submit">${button}</button>
          </form>
        </div>
        <div id="${id}-result" class="tool-output" hidden></div>
      </div>
    </section>`;
}

function toolDesk(tag, heading, items, base = "") {
  return `<article class="tool-desk">
    <p class="card-tag">${tag}</p>
    <h3>${heading}</h3>
    ${items
      .map((item) => {
        const href = base ? `${base}#${item.id}` : `#${item.id}`;
        return `<a href="${href}"><strong>${item.name}</strong><span>${item.blurb}</span></a>`;
      })
      .join("")}
  </article>`;
}

function stateSelect() {
  const states = ["FL", "CA", "CO", "DE", "MD", "MI", "NJ", "OH", "OR", "PA", "TX", "VA", "WA", "Other"];
  return `<select id="intake-state" name="state">
            <option value="">Select</option>
            ${states.map((st) => `<option value="${st}">${st}</option>`).join("")}
          </select>`;
}

function intakePage({ kind, title, description, lede, who, extraFields, coverages }) {
  const root = "../";
  const isCommercial = kind === "commercial";
  return layout({
    title: `${title} | Wellesley Collective`,
    description,
    root,
    path: `intake/${kind}.html`,
    current: "insurance",
    extraScripts: ["js/intake.js?v=6"],
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({
        src: isCommercial ? "assets/images/hero-commercial.jpg" : "assets/images/hero-home.jpg",
        alt: isCommercial ? "Commercial campus at twilight" : "A well-kept home at dusk",
        root,
        lazy: false,
      })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">${isCommercial ? "Commercial insurance" : "Personal insurance"}</p>
        <h1>${esc(title)}</h1>
        <p class="lede">${esc(lede)}</p>
      </div>
    </section>
    ${whoBlock(who)}
    <section class="section">
      <div class="container intake-wrap">
        <div class="panel intake-success" data-intake-success hidden>
          <p class="card-tag">Received</p>
          <h2>Thank you. We have the file.</h2>
          <p>We will follow up within one business day. If you attached documents, keep a copy until we confirm.</p>
          <div class="hero-actions mt-32">
            <a class="btn btn-gold" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
            <a class="btn btn-outline" href="../index.html">Back to home</a>
          </div>
        </div>
        <form class="form intake-form" data-intake="${kind}" novalidate>
          <input type="text" name="_honey" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="form-note">Only name and email are required. Everything else helps us quote faster.</p>

          <h3 class="intake-h">Contact</h3>
          <div class="form-row">
            <div class="field"><label for="intake-name">Name <span class="req">required</span></label><input id="intake-name" name="name" autocomplete="name"></div>
            <div class="field"><label for="intake-email">Email <span class="req">required</span></label><input id="intake-email" name="email" type="email" autocomplete="email"></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="intake-phone">Phone</label><input id="intake-phone" name="phone" type="tel" autocomplete="tel"></div>
            <div class="field"><label for="intake-state">State</label>${stateSelect()}</div>
          </div>
          ${
            isCommercial
              ? `<div class="form-row">
            <div class="field"><label for="intake-company">Company</label><input id="intake-company" name="company" autocomplete="organization"></div>
            <div class="field"><label for="intake-title">Title</label><input id="intake-title" name="title"></div>
          </div>`
              : ""
          }
          <div class="form-row">
            <div class="field"><label for="intake-zip">ZIP</label><input id="intake-zip" name="zip" inputmode="numeric"></div>
            <div class="field"><label for="intake-preferred">Preferred contact</label>
              <select id="intake-preferred" name="preferred_contact">
                <option value="">Select</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Text">Text</option>
              </select>
            </div>
          </div>

          <h3 class="intake-h">What to quote</h3>
          ${checkboxes("coverages", coverages)}

          ${extraFields}

          <h3 class="intake-h">Notes</h3>
          <div class="field">
            <label for="intake-message">Anything else we should know</label>
            <textarea id="intake-message" name="message" rows="4" placeholder="Claims, timeline, certificates needed, or how the property or business is used."></textarea>
          </div>

          <h3 class="intake-h">Documents</h3>
          <p class="form-note">Optional. Declarations, photos, loss runs, driver lists, applications. PDF, JPG, PNG, Word, or Excel. Up to 5 files, 8 MB each. Attached files are sent with your request so we can quote from them.</p>
          <div class="field">
            <label for="intake-files">Upload files</label>
            <input id="intake-files" name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.heic,.csv">
          </div>
          <ul class="file-list" data-file-list></ul>

          <p class="form-note" data-intake-status></p>
          <button class="btn btn-gold" type="submit">Send for a quote</button>
          <p class="disclaimer mt-32">Submitting this form does not bind coverage. Name and email are enough to start. The more you add, the faster we can quote.</p>
        </form>
      </div>
    </section>`,
  });
}

function layout({ title, description, root = "", current, content, extraScripts = [], path = "" }) {
  const css = `${root}css/styles.css?v=22`;
  const js = `${root}js/main.js?v=8`;
  const url = path ? `${SITE}/${path}` : SITE;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wellesley Collective",
    url: SITE,
    email: FIRM_EMAIL,
    telephone: FIRM_PHONE,
    description: "Licensed firm providing personal, commercial, and life insurance, annuities, and commercial financing.",
    areaServed: "US",
    sameAs: [SITE],
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:site_name" content="Wellesley Collective">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <link rel="icon" href="${root}assets/brand/favicon.png?v=3" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${css}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
${header(root, current)}
<main id="main">
${content}
</main>
${footer(root)}
<script src="${js}"></script>
${extraScripts.map((src) => `<script src="${root}${src}"></script>`).join("\n")}
</body>
</html>
`;
}

const AKA = {
  "homeowners-insurance": "Homeowners",
  "auto-insurance": "Auto",
  "personal-umbrella": "Umbrella",
  "flood-insurance": "Flood",
  "general-liability": "GL",
  "business-owners-policy": "BOP",
  "workers-compensation": "WC",
  "commercial-auto": "Fleet",
  "professional-liability": "E&O",
  "cyber-liability": "Cyber",
  "inland-marine": "Inland Marine",
  "commercial-umbrella": "Umbrella",
  "commercial-property": "Property",
  "asset-based-lending": "ABL",
  "sba-loans": "SBA",
  "commercial-real-estate": "CRE",
  "business-lines-of-credit": "LOC",
  "term-life-insurance": "Term",
  "whole-life-insurance": "Whole Life",
  "universal-life-insurance": "UL / IUL",
  "final-expense-insurance": "Final Expense",
  "business-life-insurance": "Key Person",
  "fixed-annuities": "MYGA",
  "indexed-annuities": "FIA",
  "income-annuities": "SPIA",
  "disability-insurance": "LTD",
  "long-term-care-insurance": "LTC",
};

function productTitle(item) {
  const aka = AKA[item.slug];
  if (!aka || item.name.includes(`(${aka})`) || item.name === aka) return esc(item.name);
  return `${esc(item.name)} <span class="aka">${esc(aka)}</span>`;
}

function whoLine(item) {
  if (!item.who || !item.who.length) return "";
  return item.who.slice(0, 2).join(" · ");
}

function bySlug(list, slugs) {
  return slugs.map((slug) => list.find((item) => item.slug === slug)).filter(Boolean);
}

function pickRelated(item, primary, secondary = [], count = 6) {
  const rest = primary.filter((other) => other.slug !== item.slug);
  const extra = secondary.filter((other) => other.slug !== item.slug);
  return [...rest, ...extra].slice(0, count);
}

function productCards(items, folder, cta, root) {
  return items
    .map((item) => {
      const selfQuote = isSelfQuote(item);
      const intake = intakePath(item);
      const goldHref = selfQuote
        ? `${root}insurance/quote.html`
        : intake
          ? `${root}${intake}`
          : `${root}get-started.html?product=${item.slug}`;
      const goldLabel = selfQuote ? "Get a quote" : intake ? "Start a quote" : cta;
      return `
      <article class="product-card">
        <div class="icon-dot" aria-hidden="true">+</div>
        <h3>${productTitle(item)}</h3>
        <p class="who-line">${esc(whoLine(item))}</p>
        <p>${esc(item.summary)}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a class="btn btn-gold" href="${goldHref}">${esc(goldLabel)}</a>
          <a class="btn btn-outline" href="${root}${folder}/${item.slug}.html">Learn More</a>
        </div>
      </article>`;
    })
    .join("");
}

function productIndex(items, folder, root) {
  return `
    <div class="product-index">
      ${items
        .map((item) => {
          const aka = AKA[item.slug];
          return `<a href="${root}${folder}/${item.slug}.html">${aka ? `<strong>${esc(aka)}</strong>` : `<strong>+</strong>`}<span>${esc(item.name)}</span></a>`;
        })
        .join("")}
    </div>`;
}

function whoBlock(text) {
  return `
    <section class="who-bar">
      <div class="container">
        <p class="card-tag">Who this is for</p>
        <p>${esc(text)}</p>
      </div>
    </section>`;
}

function leadForm({ root = "", product = "", need = "" }) {
  const needOptions = [
    ["insurance", "Insurance"],
    ["life", "Life insurance"],
    ["annuities", "Annuities"],
    ["financing", "Financing"],
    ["both", "More than one"],
  ]
    .map(
      ([value, label]) =>
        `<option value="${value}"${need === value ? " selected" : ""}>${label}</option>`
    )
    .join("");
  return `
  <form class="form form-lead" data-form action="https://formsubmit.co/ajax/${FIRM_EMAIL}" method="POST" novalidate>
    <input type="hidden" name="_subject" value="Wellesley Collective website inquiry">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_template" value="table">
    <input type="hidden" name="page" value="${esc(product || "service page")}">
    <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true">
    <div class="form-success">Thank you. We will follow up within one business day.</div>
    <div class="form-fields">
      <h3 class="lead-heading">Tell us what you need.</h3>
      <div class="form-row">
        <div class="field"><label for="lead-name">Name</label><input id="lead-name" name="name" required></div>
        <div class="field"><label for="lead-phone">Phone</label><input id="lead-phone" name="phone" type="tel" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="lead-email">Email</label><input id="lead-email" name="email" type="email" required></div>
        <div class="field"><label for="lead-need">Need</label>
          <select id="lead-need" name="need" required>
            <option value="">Insurance / Annuities / Financing</option>
            ${needOptions}
          </select>
        </div>
      </div>
      <p class="form-error"></p>
      <button class="btn btn-gold" type="submit">Get Started</button>
      <p class="form-note">We’ll follow up within one business day.</p>
    </div>
  </form>`;
}

function relatedReading(items, root) {
  if (!items || !items.length) return "";
  return `
    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Guides</p>
          <h2>Read this before you quote or apply.</h2>
        </div>
        <div class="grid-3">
          ${items
            .map(
              (g) => `
            <article class="product-card">
              <p class="card-tag">Guide</p>
              <h3>${esc(g.title)}</h3>
              <p>${esc(g.summary)}</p>
              <a class="btn btn-outline" href="${root}blog/${g.slug}.html">Read guide</a>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>`;
}

function convertBand({ root, product = "", need = "" }) {
  return `
    <section class="section lead-band">
      <div class="container quote-layout">
        <div>
          <p class="kicker">Next step</p>
          <h2>We’ll follow up within one business day.</h2>
          <p class="subhead">Name, phone, email, and whether you need insurance, annuities, financing, or more than one. That is enough to start.</p>
        </div>
        <div class="panel">${leadForm({ root, product, need })}</div>
      </div>
    </section>`;
}

function interestOptions(selected = "") {
  const groups = [
    ["Personal Insurance", personalLines],
    ["Commercial Insurance", commercialLines],
    ["Life Insurance", lifeProducts],
    ["Financial Services", annuityLines],
    ["Commercial Financing", loanProducts],
  ];
  let html = `<option value="">Select a service</option>`;
  for (const [label, items] of groups) {
    html += `<optgroup label="${label}">`;
    for (const item of items) {
      html += `<option value="${item.slug}"${selected === item.slug ? " selected" : ""}>${esc(item.name)}</option>`;
    }
    html += `</optgroup>`;
  }
  html += `<optgroup label="Other"><option value="general">General Inquiry</option></optgroup>`;
  return html;
}

function formBlock({ heading, button, notify = false, selected = "" }) {
  return `
  <form class="form" data-form action="https://formsubmit.co/ajax/${FIRM_EMAIL}" method="POST" novalidate>
    <input type="hidden" name="_subject" value="Wellesley Collective website inquiry">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_template" value="table">
    <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true">
    <div class="form-success">Thank you. Your request has been received. A member of our team will follow up shortly.</div>
    <div class="form-fields">
      ${heading ? `<h3 id="started-heading" style="font-family:var(--font-serif);font-size:28px;font-weight:500;color:var(--navy);margin-bottom:8px">${heading}</h3>` : ""}
      <div class="form-row">
        <div class="field"><label for="firstName">First name</label><input id="firstName" name="firstName" required></div>
        <div class="field"><label for="lastName">Last name</label><input id="lastName" name="lastName" required></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required></div>
        <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel"></div>
      </div>
      ${
        notify
          ? ""
          : `<div class="field"><label for="interest">I’m interested in</label><select id="interest" name="interest" required>${interestOptions(selected)}</select></div>`
      }
      <div class="field"><label for="message">${notify ? "Anything we should know" : "How can we help?"}</label><textarea id="message" name="message" placeholder="${notify ? "Optional notes about your timeline or market." : "Tell us about the property, business, or coverage you need."}"></textarea></div>
      <p class="form-error"></p>
      <button class="btn btn-gold" type="submit" id="started-submit">${esc(button)}</button>
      <p class="form-note">By submitting, you agree to be contacted by Wellesley Collective about your inquiry.</p>
    </div>
  </form>`;
}

const guides = [
  {
    slug: "renewing-commercial-liability",
    title: "What to review before renewing commercial liability",
    summary: "Limits, additional insureds, class codes, and the claims that actually blow through a $1 million GL policy.",
    description: "A practical renewal checklist for general liability, BOP, and commercial umbrella from Wellesley Collective.",
    kicker: "Guide",
    date: "August 2026",
    lede: "A commercial liability renewal is not a rubber stamp. The policy that fit last year can be the wrong limit, the wrong class, or the wrong additional-insured setup for the work you are doing now.",
    ctaLabel: "Review general liability",
    ctaHref: "../insurance/general-liability.html",
    body: `
      <p>Most businesses carry <a href="../insurance/general-liability.html">general liability</a> because a landlord, a general contractor, or a client asked for a certificate. That is a reason to buy it. It is not a reason to renew it on autopilot.</p>
      <p>Start with the work, not the expiring binder. If you added employees, a new service, a second location, or vehicles, the expiring <abbr title="General Liability">GL</abbr> form may still say “office” while you are on job sites. Class codes and descriptions that lag the operation are how claims get argued later.</p>
      <h2>Limits and the layer above them</h2>
      <p>One million dollars still shows up on a lot of certificates. Contracts increasingly ask for two, five, or more. If a job-site injury or a serious auto claim would not finish inside the primary limit, price a <a href="../insurance/commercial-umbrella.html">commercial umbrella</a> instead of hoping the primary policy stretches.</p>
      <h2>Certificates, additional insureds, and waivers</h2>
      <p>The certificate is not the policy. If a GC wants additional-insured wording, a waiver of subrogation, or primary-and-noncontributory language, those have to live on the form — not only on the PDF you email. Review the last six certificates you issued. If they all request something your policy does not actually grant, fix the policy before the next bid.</p>
      <h2>What else should sit next to GL</h2>
      <ul>
        <li>Employees on payroll almost always mean <a href="../insurance/workers-compensation.html">workers’ compensation</a>, not a GL endorsement.</li>
        <li>Work trucks and employee errands belong on <a href="../insurance/commercial-auto.html">commercial auto</a>, including hired and non-owned coverage when it fits.</li>
        <li>A small office or shop may still be better in a <a href="../insurance/business-owners-policy.html">BOP</a> than in a standalone GL plus a thin property form. See our guide on <a href="bop-vs-gl-and-property.html">BOP vs. separate GL and property</a>.</li>
        <li>Tools and machines that leave the shop need <a href="../insurance/inland-marine.html">inland marine</a>, not a building limit at the warehouse address.</li>
      </ul>
      <p>Bring last year’s policy, this year’s contracts, payroll, and a plain list of what you actually do. Wellesley Collective will tell you whether to renew, restructure, or add a layer — and follow up within one business day.</p>
    `,
  },
  {
    slug: "bridge-vs-permanent-cre",
    title: "Bridge loan vs. permanent CRE financing",
    summary: "When speed is the product, when a 10-year mortgage is the product, and what a clean exit looks like.",
    description: "How Wellesley Collective compares bridge financing and permanent commercial real estate loans for acquisitions, renovations, and maturities.",
    kicker: "Guide",
    date: "August 2026",
    lede: "A bridge loan is not a cheaper commercial mortgage. It is a short-term tool for a defined gap. Permanent CRE debt is what you take out when the story is stable.",
    ctaLabel: "Compare CRE options",
    ctaHref: "../commercial-loans/commercial-real-estate.html",
    body: `
      <p>Borrowers mix these up because both can fund a building. They are not interchangeable.</p>
      <p><a href="../commercial-loans/bridge-financing.html">Bridge financing</a> exists for the messy middle: you won a property on a 30-day clock, you are renovating, a loan is maturing before the take-out is ready, or occupancy is not yet where a permanent lender wants it. The term is short on purpose. Cost is higher on purpose. The file has to answer one question on day one: how do we get off this loan?</p>
      <p>A <a href="../commercial-loans/commercial-real-estate.html">commercial real estate loan</a> is the longer hold — purchase, refinance, or recapitalization on multifamily, industrial, retail, office, hotel, or self-storage that already underwrites. Rent rolls, occupancy, sponsorship, and a capital stack that makes sense at today’s rates matter more than speed.</p>
      <h2>Use a bridge when</h2>
      <ul>
        <li>Closing has to happen before permanent underwriting can finish.</li>
        <li>You are executing a value-add plan and the exit is a refinance or sale you can describe in one sentence.</li>
        <li>A 2026 or 2027 maturity is close and you need time, not a 10-year story you do not have yet.</li>
      </ul>
      <h2>Use permanent CRE when</h2>
      <ul>
        <li>The asset is leased or owner-occupied and the cash flow is the story.</li>
        <li>You want duration, not a 12-month fuse.</li>
        <li>You occupy the building and <a href="../commercial-loans/sba-loans.html">SBA 504</a> may be the cleaner owner-user path.</li>
      </ul>
      <p>If the project is still in the ground, start with <a href="../commercial-loans/construction-development.html">construction financing</a>, not a bridge labeled as construction. Draws, inspections, and a take-out are a different file. Wellesley Collective will say which structure fits before you spend a month in the wrong box.</p>
    `,
  },
  {
    slug: "bop-vs-gl-and-property",
    title: "BOP vs. separate general liability and property",
    summary: "When a packaged business owners policy is enough, and when a contractor or manufacturer has already outgrown it.",
    description: "How Wellesley Collective decides between a BOP and standalone general liability plus commercial property.",
    kicker: "Guide",
    date: "August 2026",
    lede: "A BOP is a bundle: liability and property in one policy. It is the right starting point for many offices and shops. It is the wrong box for a lot of contractors and anything that looks like heavy operations.",
    ctaLabel: "Review a BOP",
    ctaHref: "../insurance/business-owners-policy.html",
    body: `
      <p>A <a href="../insurance/business-owners-policy.html">business owners policy</a> exists because small firms keep buying the same two things: protect the stuff, and protect the business if someone gets hurt. Packaging <a href="../insurance/general-liability.html">general liability</a> with <a href="../insurance/commercial-property.html">commercial property</a> can be simpler and cheaper than two custom forms.</p>
      <p>Eligibility is the catch. Carriers write BOPs for offices, retail, and light service. They do not write them for every trade, every manufacturer, or every risk that lives on job sites all day. If the operation has already outgrown the box, forcing a BOP is how you get a non-renewal or a denied class.</p>
      <h2>Stay in a BOP when</h2>
      <ul>
        <li>You have a defined location, modest payroll, and customers who come to you.</li>
        <li>You want one policy for contents, the suite, and slip-and-fall liability.</li>
        <li>Business income can be added without building a custom package.</li>
      </ul>
      <h2>Split GL and property when</h2>
      <ul>
        <li>You are an <a href="../insurance/artisan-contractors.html">artisan contractor</a> whose real exposure is on other people’s property.</li>
        <li>The building, inventory, or equipment limit is larger than a BOP appetite.</li>
        <li>You need a <a href="../insurance/commercial-umbrella.html">commercial umbrella</a>, <a href="../insurance/workers-compensation.html">workers’ compensation</a>, and <a href="../insurance/commercial-auto.html">commercial auto</a> as a coordinated program, not as afterthoughts on a package.</li>
      </ul>
      <p>Either way, a BOP is not cyber, not E&amp;O, and not flood. Read <a href="renewing-commercial-liability.html">what to review before renewing commercial liability</a> before you treat the anniversary as automatic.</p>
    `,
  },
  {
    slug: "sba-7a-what-lenders-review",
    title: "What a lender reviews on an SBA 7(a) or 504 file",
    summary: "Use of proceeds, occupancy, cash flow, and the documents that keep an SBA file moving after SBSS scoring went away.",
    description: "A plain-English list of what SBA 7(a) and 504 underwriting looks at, from Wellesley Collective.",
    kicker: "Guide",
    date: "August 2026",
    lede: "SBA loans are still one of the better tools for owner-occupied real estate, equipment, and certain acquisitions. They are not grants, and they are no longer a FICO-shortcut product.",
    ctaLabel: "Ask about SBA financing",
    ctaHref: "../commercial-loans/sba-loans.html",
    body: `
      <p>Wellesley Collective treats <a href="../commercial-loans/sba-loans.html">SBA loans</a> as regular commercial credit with a government guarantee behind part of the note. That guarantee can mean a longer term or a lower down payment. It does not mean thin files get a yes.</p>
      <p>7(a) is the flexible program: working capital, equipment, some acquisitions, and some real estate. 504 is the owner-occupied real estate and long-life equipment program. You generally cannot use 504 to buy a purely investment building. Occupancy rules are real.</p>
      <h2>What belongs in the package</h2>
      <ul>
        <li>Business and personal tax returns, plus an interim financial statement.</li>
        <li>A sentence on use of proceeds that matches the bank statements.</li>
        <li>For real estate, who will occupy the building and at what percentage.</li>
        <li>Debt schedule, ownership, and any affiliate companies.</li>
      </ul>
      <p>After SBA ended SBSS scoring for 7(a) small loans in 2026, more files are underwritten the old way: cash flow, time in business, and documentation. A complete package still clears. A score-era shortcut often stalls. See our briefing on <a href="march-sba-7a-underwriting.html">the March 2026 7(a) underwriting change</a>.</p>
      <p>If SBA is the wrong tool, say so early and look at <a href="../commercial-loans/commercial-real-estate.html">conventional CRE</a>, <a href="../commercial-loans/equipment-financing.html">equipment financing</a>, or <a href="../commercial-loans/working-capital.html">working capital</a> instead of forcing a 504 onto an investment story.</p>
    `,
  },
  {
    slug: "homeowners-renewal-checklist",
    title: "What to review before a homeowners insurance renewal",
    summary: "Rebuild cost, roof, water, deductibles, and the flood gap that a standard HO-3 never fills.",
    description: "A homeowners renewal checklist from Wellesley Collective covering dwelling limits, endorsements, and flood.",
    kicker: "Guide",
    date: "August 2026",
    lede: "Premiums have been rising faster than inflation, and more policies are being non-renewed. The worst time to notice a gap is after the letter arrives — or after the loss.",
    ctaLabel: "Review homeowners coverage",
    ctaHref: "../insurance/homeowners-insurance.html",
    body: `
      <p><a href="../insurance/homeowners-insurance.html">Homeowners insurance</a> is supposed to rebuild the house you live in, not honor the price you paid in 2017. Start the renewal with rebuild cost, not Zillow.</p>
      <h2>Five items that actually change the claim</h2>
      <ul>
        <li><strong>Dwelling limit.</strong> Construction and labor have outrun sale prices in a lot of ZIP codes. A cheap limit is a coinsurance problem.</li>
        <li><strong>Roof and water.</strong> Age, material, water backup, and ordinance-or-law coverage decide more claims than the marketing brochure.</li>
        <li><strong>Wind, hail, and hurricane deductibles.</strong> A percentage deductible on a coastal or hail-exposed house is a different product than a $2,500 flat.</li>
        <li><strong>Liability.</strong> Teen drivers, a pool, a rental unit, or a boat are why people add a <a href="../insurance/personal-umbrella.html">personal umbrella</a>.</li>
        <li><strong>Flood.</strong> It is still not in the homeowners form. Price <a href="../insurance/flood-insurance.html">flood insurance</a> as its own policy. We keep a standing reminder: <a href="flood-coverage-reminder.html">flood is still not in a standard homeowners policy</a>.</li>
      </ul>
      <p>Condo owners should match the HO-6 to the association master policy, including loss assessment. Landlords should not assume a tenant’s renters policy protects the building. If a non-renewal letter already went out, do not wait out the remaining days. Replacement markets move while you still have coverage in force.</p>
      <p>Wellesley Collective will review the declaration page against the house you actually occupy and follow up within one business day.</p>
    `,
  },
  {
    slug: "working-capital-vs-line-of-credit",
    title: "Working capital vs. a business line of credit",
    summary: "A lump sum for a defined gap, or a reusable facility you draw and repay. Which one matches the cash-flow problem.",
    description: "How Wellesley Collective chooses between short-term working capital and a revolving business line of credit.",
    kicker: "Guide",
    date: "August 2026",
    lede: "Both products put cash into operations. One is a closed-end advance. The other is a reusable pool. Mixing them up is how you pay for the wrong structure.",
    ctaLabel: "Discuss business credit",
    ctaHref: "../commercial-loans/working-capital.html",
    body: `
      <p><a href="../commercial-loans/working-capital.html">Working capital</a> is usually a short-term lump sum for a defined use: payroll through a slow month, a seasonal inventory build, a supplier deposit. You take the money, you pay it back, you are done. It is a poor fit for buying a building and a poor fit for a need that repeats every month forever.</p>
      <p>A <a href="../commercial-loans/business-lines-of-credit.html">business line of credit</a> is a reusable limit. You draw, repay, and draw again. Interest typically sits on the outstanding balance, not the full commitment. That is the right tool when inventory and receivables move in a cycle and you are tired of opening a new short-term loan every quarter.</p>
      <h2>Pick working capital when</h2>
      <ul>
        <li>The use is one-time and you can point to the repayment.</li>
        <li>You would rather have a known payoff date than an open facility.</li>
      </ul>
      <h2>Pick a line when</h2>
      <ul>
        <li>The same gap keeps showing up — suppliers, invoices, seasonality.</li>
        <li>You want the facility in place before you need it.</li>
      </ul>
      <p>If unpaid invoices and inventory are the real collateral story, look at <a href="../commercial-loans/asset-based-lending.html">asset-based lending</a> instead of stretching an unsecured line. If the money is for a machine, use <a href="../commercial-loans/equipment-financing.html">equipment financing</a>. Wellesley Collective will match the facility to the cash-flow problem, not to the largest number someone will quote.</p>
    `,
  },
  {
    slug: "commercial-auto-vs-personal-auto",
    title: "When a work vehicle needs commercial auto, not a personal policy",
    summary: "Title, use, deliveries, and hired/non-owned coverage — the points where a personal auto policy usually stops.",
    description: "How Wellesley Collective decides between personal auto and commercial auto for work trucks, vans, and employee driving.",
    kicker: "Guide",
    date: "August 2026",
    lede: "If the vehicle is titled to the business, or used mainly for work, a personal auto policy is usually the wrong policy. Commercial auto is the form written for that use.",
    ctaLabel: "Review commercial auto",
    ctaHref: "../insurance/commercial-auto.html",
    body: `
      <p><a href="../insurance/auto-insurance.html">Personal auto</a> is built for household driving. <a href="../insurance/commercial-auto.html">Commercial auto</a> is built for vehicles the business owns, rents, or sends employees out in. Insurers care about title, use, and radius — not what you call the truck in conversation.</p>
      <p>A service van, a contractor fleet, or a car that does deliveries all day is commercial use even if it comes home at night. Putting that unit on a personal policy is how a claim gets delayed or denied. The same gap shows up when staff run errands in their own cars on company business. That is hired and non-owned auto, and it belongs on the commercial form when the exposure is real.</p>
      <h2>Move it to commercial auto if</h2>
      <ul>
        <li>The title is in the company name.</li>
        <li>The vehicle carries tools, inventory, or customers as a regular part of the job.</li>
        <li>You rent vans or have employees driving personal cars for work.</li>
        <li>A personal insurer has already said the use is commercial.</li>
      </ul>
      <p>Liability limits on the auto policy should match the rest of the program. If GL and auto are $1 million and a contract wants $5 million, the next conversation is a <a href="../insurance/commercial-umbrella.html">commercial umbrella</a>, not a hope that the auto policy will be enough. Pair this with <a href="renewing-commercial-liability.html">the commercial liability renewal checklist</a> before the next certificate request.</p>
    `,
  },
  {
    slug: "term-vs-permanent-life",
    title: "Term life vs. whole life and universal life",
    summary: "A cheap 20-year death benefit, a policy that lasts a lifetime, or a flexible UL/IUL design. Which job you are actually hiring.",
    description: "How Wellesley Collective compares term, whole life, guaranteed UL, and indexed UL — including when return-of-premium term is worth the extra cost.",
    kicker: "Guide",
    date: "August 2026",
    lede: "Term, whole life, and universal life all pay a death benefit. They are not interchangeable. The right policy is the one that still makes sense if you live, not only if you die.",
    ctaLabel: "Get a life insurance quote",
    ctaHref: "../insurance/quote.html",
    body: `
      <p><a href="../insurance/term-life-insurance.html">Term life</a> is a lease. You buy a large death benefit for 10, 15, 20, or 30 years at the lowest premium of the three. If you die during the term, the people you named are paid. If you outlive it, the coverage ends unless you convert or renew. There is usually no cash value. That is the right product for income replacement, a mortgage, or a defined obligation with an end date.</p>
      <p><a href="../insurance/whole-life-insurance.html">Whole life</a> is a purchase. Premiums, death benefit, and a minimum cash-value schedule are in the contract. It costs more because it is built to still be there at 80. People use it for lifelong protection, estate liquidity, and a conservative cash-value component — not because a dividend illustration looked attractive.</p>
      <p><a href="../insurance/universal-life-insurance.html">Universal life</a> is the flexible permanent form. Traditional UL credits a declared rate. Guaranteed UL (GUL) is mainly a no-lapse death benefit to a stated age. Indexed UL (IUL) uses an index formula with a cap and a floor; it is not a stock purchase. Variable UL is a different product with market risk and a prospectus. Underfunded UL is how policies lapse. Read the guaranteed column, not only the illustrated one.</p>
      <h2>Use term when</h2>
      <ul>
        <li>The need ends — kids grown, mortgage paid, a loan retired.</li>
        <li>You want the most death benefit per dollar today.</li>
        <li>You may convert later. Conversion, when it is in the contract, is how term becomes permanent without a new exam.</li>
      </ul>
      <h2>Use permanent when</h2>
      <ul>
        <li>The need has no end date: estate liquidity, a special-needs dependent, a buy-sell that should outlast a 20-year term.</li>
        <li>You want cash value you can borrow against, understanding that loans reduce the death benefit if they are not repaid.</li>
        <li>A GUL priced to a no-lapse guarantee is cheaper than whole life for a death-benefit-only job.</li>
      </ul>
      <p>Return-of-premium term costs more than standard term and can give premiums back if you outlive the period. <a href="../insurance/final-expense-insurance.html">Final expense</a> is a small whole-life policy for funeral costs, not a substitute for a $1 million term policy. <a href="../insurance/business-life-insurance.html">Key-person and buy-sell coverage</a> is the business version of the same decision: match the duration of the policy to the duration of the need.</p>
      <p>An annuity is a different job. If the need is a stated rate, a floor, or a paycheck, that conversation is <a href="../financial-services/index.html">Financial Services</a>, not a life policy. Life insurance stays under Insurance. You can <a href="../insurance/quote.html">quote term and permanent life yourself</a>, or we will review the file. Health history is underwriting, not a reason to stay silent.</p>
    `,
  },
  {
    slug: "annuity-types-explained",
    title: "Fixed, indexed, and income annuities — which is which",
    summary: "MYGAs, fixed indexed annuities, SPIAs, and DIAs. What each contract actually does, and what it is not.",
    description: "A plain-English comparison of fixed annuities, MYGAs, indexed annuities, SPIAs, and deferred income annuities from Wellesley Collective.",
    kicker: "Guide",
    date: "August 2026",
    lede: "Annuities are insurance contracts, not bank accounts and not mutual funds. The type you buy decides whether you get a stated rate, an index formula, or a paycheck.",
    ctaLabel: "Ask about annuities",
    ctaHref: "../financial-services/index.html",
    body: `
      <p>People say “annuity” as if it were one product. It is four different jobs wearing the same word.</p>
      <p>A <a href="../financial-services/fixed-annuities.html">fixed annuity</a> credits a declared rate. A MYGA (multi-year guaranteed annuity) locks that rate for a set term, often 3, 5, or 7 years. It is an insurance contract, not a CD. It is not FDIC insured. Guarantees depend on the issuing carrier. Liquidity is limited by surrender charges. Tax on gains usually waits until you take the money out.</p>
      <p>An <a href="../financial-services/indexed-annuities.html">indexed annuity</a> (FIA) does not buy the index. It uses an index to calculate a credit, typically with a cap, a participation rate, and a 0% floor for that period. In a down year that slice is not supposed to take the market loss. Caps change. An optional lifetime-income rider is a separate, paid-for decision. Do not buy an FIA because an illustration showed last year’s cap forever.</p>
      <p>An <a href="../financial-services/income-annuities.html">income annuity</a> turns a lump sum into checks. A SPIA starts almost immediately. A DIA (deferred income annuity) starts later — longevity insurance for the years you might live past 85. Once you annuitize, you generally cannot get the principal back. That is the trade for a paycheck you cannot outlive.</p>
      <h2>Match the contract to the job</h2>
      <ul>
        <li><strong>Park money for a defined term at a stated rate.</strong> Start with a MYGA or declared-rate fixed annuity.</li>
        <li><strong>Want a floor under a portion of savings, and can leave it for the surrender period.</strong> An FIA can be the slice — not the whole portfolio.</li>
        <li><strong>Need a paycheck for life, and can give up the lump sum.</strong> A SPIA (now) or a DIA (later).</li>
      </ul>
      <p>None of these is a checking account, a growth-equity substitute, or a replacement for <a href="../insurance/term-life-insurance.html">life insurance</a>. Life coverage is insurance. Annuities sit under <a href="../financial-services/index.html">Financial Services</a>. If the household still needs a death benefit, buy life insurance for that job. If a spouse would need care, look at <a href="../insurance/long-term-care-insurance.html">long-term care coverage</a> separately. Wellesley Collective will quote the contract that matches the use of funds and tell you when an annuity is the wrong box.</p>
    `,
  },
];

function guidesFor(...slugs) {
  return slugs.map((slug) => guides.find((g) => g.slug === slug)).filter(Boolean);
}

const PRODUCT_GUIDES = {
  "homeowners-insurance": ["homeowners-renewal-checklist", "renewing-commercial-liability"],
  "auto-insurance": ["commercial-auto-vs-personal-auto", "homeowners-renewal-checklist"],
  "renters-insurance": ["homeowners-renewal-checklist"],
  "condo-insurance": ["homeowners-renewal-checklist"],
  "personal-umbrella": ["homeowners-renewal-checklist"],
  "watercraft-insurance": ["homeowners-renewal-checklist"],
  "flood-insurance": ["homeowners-renewal-checklist"],
  "general-liability": ["renewing-commercial-liability", "bop-vs-gl-and-property"],
  "commercial-property": ["bop-vs-gl-and-property", "renewing-commercial-liability"],
  "commercial-auto": ["commercial-auto-vs-personal-auto", "renewing-commercial-liability"],
  "workers-compensation": ["renewing-commercial-liability"],
  "business-owners-policy": ["bop-vs-gl-and-property", "renewing-commercial-liability"],
  "artisan-contractors": ["renewing-commercial-liability", "commercial-auto-vs-personal-auto"],
  "professional-liability": ["renewing-commercial-liability"],
  "inland-marine": ["renewing-commercial-liability"],
  "commercial-umbrella": ["renewing-commercial-liability", "bop-vs-gl-and-property"],
  "cyber-liability": ["renewing-commercial-liability"],
  "commercial-flood": ["homeowners-renewal-checklist", "renewing-commercial-liability"],
  "working-capital": ["working-capital-vs-line-of-credit", "sba-7a-what-lenders-review"],
  "equipment-financing": ["working-capital-vs-line-of-credit", "sba-7a-what-lenders-review"],
  "asset-based-lending": ["working-capital-vs-line-of-credit"],
  "business-lines-of-credit": ["working-capital-vs-line-of-credit"],
  "unsecured-term-loans": ["working-capital-vs-line-of-credit"],
  "commercial-real-estate": ["bridge-vs-permanent-cre", "sba-7a-what-lenders-review"],
  "bridge-financing": ["bridge-vs-permanent-cre"],
  "construction-development": ["bridge-vs-permanent-cre"],
  "sba-loans": ["sba-7a-what-lenders-review", "bridge-vs-permanent-cre"],
  "term-life-insurance": ["term-vs-permanent-life", "annuity-types-explained"],
  "whole-life-insurance": ["term-vs-permanent-life"],
  "universal-life-insurance": ["term-vs-permanent-life", "annuity-types-explained"],
  "final-expense-insurance": ["term-vs-permanent-life"],
  "business-life-insurance": ["term-vs-permanent-life"],
  "fixed-annuities": ["annuity-types-explained", "term-vs-permanent-life"],
  "indexed-annuities": ["annuity-types-explained"],
  "income-annuities": ["annuity-types-explained"],
  "disability-insurance": ["term-vs-permanent-life"],
  "long-term-care-insurance": ["annuity-types-explained", "term-vs-permanent-life"],
};

const pages = [];

pages.push({
  file: "index.html",
  html: layout({
    title: "Wellesley Collective | Insurance, Financial Services & Commercial Financing",
    description: "Wellesley Collective quotes personal, commercial, and life insurance, annuities, and commercial financing in one licensed firm.",
    path: "index.html",
    current: "home",
    content: `
    <section class="hero">
      <div class="hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "Evening city skyline over a commercial district", lazy: false, priority: true })}</div>
      <div class="container hero-content">
        <p class="eyebrow">Wellesley Collective</p>
        <h1>One relationship for protection and capital.</h1>
        <p class="lede">Insurance and commercial financing, handled by one licensed team. You stay with the same people from the first conversation through placement or funding.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="get-started.html">Get Started</a>
          <a class="btn btn-ghost" href="https://calendly.com/rasheed-wellesleycollective/30min" target="_blank" rel="noopener">Book a call</a>
        </div>
      </div>
    </section>

    <section class="trust-bar">
      <div class="container trust-row">
        <div class="trust-item"><strong>One relationship</strong><span>Insurance, financial services, and commercial financing with a single point of contact.</span></div>
        <div class="trust-item"><strong>Licensed team</strong><span>Coverage and capital handled by professionals who know the work.</span></div>
        <div class="trust-item"><strong>Personal &amp; commercial</strong><span>Household, business, and life coverage — plus financing — in one firm.</span></div>
        <div class="trust-item"><strong>Clear next steps</strong><span>A quote, an application, or a conversation — then a defined path forward.</span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">What we do</p>
          <h2>Protection, income, and capital. One standard of care.</h2>
          <p>Insure a household or a business, including life coverage. Place annuities when the job is income or accumulation. Raise capital for operations and commercial property — without starting over at a different firm each time.</p>
        </div>
        <div class="grid-3">
          <article class="card">
            <div class="card-media">${photo({ src: "assets/images/service-insurance.jpg", alt: "Commercial building and work fleet, representing commercial insurance" })}</div>
            <div class="card-body">
              <p class="card-tag">Protection</p>
              <h3>Insurance</h3>
              <p>Personal lines, commercial lines, and life insurance — term, whole life, universal life, final expense, disability, and long-term care.</p>
              <div class="hero-actions">
                <a class="btn btn-navy" href="insurance/index.html">Explore Insurance</a>
                <a class="btn btn-outline" href="intake/personal.html">Personal quote</a>
                <a class="btn btn-outline" href="intake/commercial.html">Commercial quote</a>
              </div>
            </div>
          </article>
          <article class="card">
            <div class="card-media">${photo({ src: "assets/images/about-office.jpg", alt: "Private conference room for annuity and financial planning conversations" })}</div>
            <div class="card-body">
              <p class="card-tag">Income &amp; accumulation</p>
              <h3>Financial Services</h3>
              <p>Fixed, indexed, and income annuities — MYGAs, SPIAs, and DIAs — when the job is a stated rate, a floor, or a paycheck.</p>
              <a class="btn btn-navy" href="financial-services/index.html">Explore Annuities</a>
            </div>
          </article>
          <article class="card">
            <div class="card-media">${photo({ src: "assets/images/service-commercial-loans.jpg", alt: "Capital and loan documents on a conference table, representing commercial funding" })}</div>
            <div class="card-body">
              <p class="card-tag">Capital</p>
              <h3>Commercial Financing</h3>
              <p>Working capital, equipment, asset-based lending, commercial real estate, bridge, construction, and SBA financing for operators and investors.</p>
              <a class="btn btn-navy" href="commercial-loans/index.html">Explore Financing</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-cream">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Resource Center</p>
          <h2>Eight tools. One desk.</h2>
          <p>Flood maps, entity lookup, DSCR, VIN, longevity, and more — grouped here so nothing is scattered around the site.</p>
        </div>
        <div class="tool-desks">
          ${toolDesk(
            "Property & vehicles",
            "Start with a place or a VIN.",
            [
              { id: "flood", name: "Flood zone lookup", blurb: "FEMA flood zone and a flood-quote handoff." },
              { id: "risk", name: "Property risk checker", blurb: "NWS alerts and USGS seismic history." },
              { id: "vin", name: "VIN decoder", blurb: "Year, make, model, then the right auto form." },
            ],
            "resources/index.html"
          )}
          ${toolDesk(
            "Business & capital",
            "Commercial insurance and financing.",
            [
              { id: "entity", name: "Entity lookup", blurb: "Legal name, then the commercial quote." },
              { id: "dscr", name: "DSCR calculator", blurb: "NOI versus annual debt service, live." },
              { id: "sba", name: "SBA 7(a) / 504 snapshot", blurb: "Program limits and typical terms." },
            ],
            "resources/index.html"
          )}
          ${toolDesk(
            "Life & money",
            "Longevity, income, and cash.",
            [
              { id: "longevity", name: "Longevity & income gap", blurb: "SSA life table versus the paycheck you want." },
              { id: "inflation", name: "Inflation calculator", blurb: "What uninvested cash is worth." },
            ],
            "resources/index.html"
          )}
        </div>
        <div class="hero-actions mt-32">
          <a class="btn btn-navy" href="resources/index.html">Open the Resource Center</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        ${figurePhoto({ src: "assets/images/about-office.jpg", alt: "Private conference room with city views", caption: "A quiet room for coverage, capital, and the facts of the file." })}
        <div class="split-copy">
          <p class="kicker">How we work</p>
          <h2>One firm. Coverage and capital in the same conversation.</h2>
          <p>Wellesley Collective is built for clients who want a composed, professional process. We listen first, then quote the coverage or structure the financing that fits.</p>
          <p>You stay with one relationship from the first conversation through quote, close, or placement.</p>
          <div class="hero-actions">
            <a class="btn btn-navy" href="about.html">About the Firm</a>
            <a class="btn btn-outline" href="get-started.html">Get Started</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head center">
          <p class="kicker">The process</p>
          <h2>Simple, considered, and discreet.</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-num" aria-hidden="true">01</div>
            <h3>Share the need</h3>
            <p>Tell us about the household, business, property, or capital request. A short conversation is usually enough to determine fit.</p>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">02</div>
            <h3>Build the solution</h3>
            <p>We review the risk, asset, or financing need and prepare a quote or a clear path to funding.</p>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">03</div>
            <h3>Move with clarity</h3>
            <p>You receive a defined path — a quote, underwriting, or financing next steps — with the same team throughout.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <blockquote class="pull-quote">
          <p>Coverage and capital in the same conversation.</p>
          <cite>Wellesley Collective</cite>
        </blockquote>
      </div>
    </section>

    <section class="section section-navy">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Why Wellesley</p>
          <h2>Trust is built in the details.</h2>
          <p>We take responsibility for the quality of the recommendation, the clarity of the conversation, and the professionalism of the experience.</p>
        </div>
        <div class="pillars">
          <div class="pillar">
            <h3>Independent judgment</h3>
            <p>Recommendations are based on the client’s facts, not a single-product mandate. If a request is not a fit, we say so early.</p>
          </div>
          <div class="pillar">
            <h3>Breadth without noise</h3>
            <p>Personal lines, commercial lines, life insurance, annuities, and business capital live in one firm so related decisions can be coordinated.</p>
          </div>
          <div class="pillar">
            <h3>Direct accountability</h3>
            <p>We stay involved from first conversation through quote and close so the process remains orderly and understandable.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Guides from Wellesley Collective</p>
          <h2>Practical reading before you quote or apply.</h2>
          <p>Evergreen explainers on the products people actually search — plus this week’s market briefings.</p>
        </div>
        <div class="grid-3">
          <article class="product-card">
            <p class="card-tag">Guide</p>
            <h3>What to review before renewing commercial liability</h3>
            <p>Limits, additional insureds, class codes, and the layer above a $1 million GL policy.</p>
            <a class="btn btn-outline" href="blog/renewing-commercial-liability.html">Read guide</a>
          </article>
          <article class="product-card">
            <p class="card-tag">Guide</p>
            <h3>Bridge loan vs. permanent CRE financing</h3>
            <p>When speed is the product, when a 10-year mortgage is the product, and what a clean exit looks like.</p>
            <a class="btn btn-outline" href="blog/bridge-vs-permanent-cre.html">Read guide</a>
          </article>
          <article class="product-card">
            <p class="card-tag">Guide</p>
            <h3>Term life vs. whole life and universal life</h3>
            <p>A cheap 20-year death benefit, a policy that lasts a lifetime, or a flexible UL/IUL design.</p>
            <a class="btn btn-outline" href="blog/term-vs-permanent-life.html">Read guide</a>
          </article>
        </div>
        <div class="hero-actions mt-32">
          <a class="btn btn-navy" href="blog/index.html">All guides and briefings</a>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <p class="eyebrow" style="justify-content:center">Begin a conversation</p>
        <h2>Ready to protect what you own or fund what you are building?</h2>
        <p>Get started on insurance, annuities, or commercial financing.</p>
        <div class="hero-actions" style="justify-content:center">
          <a class="btn btn-gold" href="get-started.html">Get Started</a>
          <a class="btn btn-ghost" href="contact.html">Contact Us</a>
        </div>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "about.html",
  html: layout({
    title: "About | Wellesley Collective",
    description: "Meet Rasheed Wellesley, owner of Wellesley Collective — a licensed Florida firm for personal, commercial, and life insurance, annuities, and commercial financing.",
    path: "about.html",
    current: "about",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/about-office.jpg?v=5", alt: "Private client office overlooking the city", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">The firm</p>
        <h1>A licensed practice with one person accountable for the file.</h1>
        <p class="lede">Wellesley Collective is the independent firm of Rasheed Wellesley. Insurance, annuities, and commercial financing sit in one relationship — not three handoffs.</p>
      </div>
    </section>

    <section class="section">
      <div class="container split about-principal">
        ${figurePhoto({
          src: "assets/images/rasheed-wellesley.jpg?v=1",
          alt: "Rasheed Wellesley, owner of Wellesley Collective",
          caption: "Rasheed Wellesley · Owner",
        })}
        <div class="split-copy">
          <p class="kicker">The owner</p>
          <h2>Rasheed Wellesley</h2>
          <p>You work with Rasheed. He is a Florida-resident licensed insurance agent and the owner of Wellesley Collective LLC. The practice is built for households and operators who want a direct conversation about coverage and capital — not a call center and a new person at every step.</p>
          <p>He has held a Florida agent license since 2021, with authority for general lines (property and casualty) and life including variable annuities. He is also licensed as a non-resident in additional states. Products, appointments, and what can be placed still depend on the state and the file.</p>
          <ul class="about-facts">
            <li><strong>Role</strong> Owner, Wellesley Collective</li>
            <li><strong>NPN</strong> 19762898</li>
            <li><strong>Resident license</strong> Florida · Agent</li>
            <li><strong>Phone</strong> <a href="tel:${FIRM_TEL}">${FIRM_PHONE}</a></li>
            <li><strong>Email</strong> <a href="mailto:${FIRM_EMAIL}">${FIRM_EMAIL}</a></li>
          </ul>
          <div class="hero-actions mt-32">
            <a class="btn btn-gold" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
            <a class="btn btn-outline" href="contact.html">Contact</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-cream">
      <div class="container">
        <div class="section-head">
          <p class="kicker">How the firm is built</p>
          <h2>Protection, income, and capital in one practice.</h2>
          <p>Households and businesses rarely experience risk and money as separate problems. A growing company needs liability coverage and a line of credit. A family needs the house insured and a life policy that actually fits. Wellesley Collective was formed to sit at that intersection.</p>
        </div>
        <div class="grid-3">
          <article class="product-card">
            <p class="card-tag">Insurance</p>
            <h3>Personal, commercial, and life</h3>
            <p>Property, casualty, and life insurance — including term, whole life, universal life, and final expense — quoted and placed by a licensed agent.</p>
            <a class="btn btn-outline" href="insurance/index.html">Explore insurance</a>
          </article>
          <article class="product-card">
            <p class="card-tag">Financial services</p>
            <h3>Annuities</h3>
            <p>Fixed, indexed, and income annuities when the job is a stated rate, a floor, or a paycheck. Separate from life insurance on purpose.</p>
            <a class="btn btn-outline" href="financial-services/index.html">Explore annuities</a>
          </article>
          <article class="product-card">
            <p class="card-tag">Capital</p>
            <h3>Commercial financing</h3>
            <p>Working capital, equipment, CRE, SBA, bridge, and lines of credit for operators and commercial property — subject to credit and documentation.</p>
            <a class="btn btn-outline" href="commercial-loans/index.html">Explore financing</a>
          </article>
        </div>
        <div class="hero-actions mt-32">
          <a class="btn btn-navy" href="resources/index.html">Resource Center</a>
          <a class="btn btn-outline" href="get-started.html">Get Started</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Licensing</p>
          <h2>Florida resident, licensed in additional states.</h2>
          <p>Resident license in Florida. Non-resident licenses currently include California, Colorado, Delaware, Maryland, Michigan, New Jersey, Ohio, Oregon, Pennsylvania, Texas, Virginia, and Washington. Confirm the state before you assume a product can be written there.</p>
        </div>
        <div class="state-list" aria-label="Licensed states">
          ${["FL", "CA", "CO", "DE", "MD", "MI", "NJ", "OH", "OR", "PA", "TX", "VA", "WA"]
            .map((st) => `<span>${st}</span>`)
            .join("")}
        </div>
        <p class="disclaimer mt-32">NPN 19762898. License status can be verified through NIPR. Lines of authority, appointments, and available products vary by state.</p>
      </div>
    </section>

    <section class="section section-cream">
      <div class="container">
        <div class="section-head">
          <p class="kicker">What you can expect</p>
          <h2>Professional standards, plainly kept.</h2>
        </div>
        <div class="grid-3">
          <article class="product-card">
            <div class="icon-dot">01</div>
            <h3>Clarity over volume</h3>
            <p>We would rather decline a poor fit than force a product. Every inquiry is reviewed for purpose, timing, and whether we can actually help.</p>
          </article>
          <article class="product-card">
            <div class="icon-dot">02</div>
            <h3>Coordinated advice</h3>
            <p>Insurance and financing decisions inform one another. When both are in play, we keep the conversation connected rather than fragmented.</p>
          </article>
          <article class="product-card">
            <div class="icon-dot">03</div>
            <h3>Discreet handling</h3>
            <p>Personal, business, and property information is treated as confidential and used only to serve your request.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head center">
          <p class="kicker">The process</p>
          <h2>Simple, considered, and direct.</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-num" aria-hidden="true">01</div>
            <h3>Share the need</h3>
            <p>Tell us about the household, business, property, or capital request. A short conversation is usually enough to determine fit.</p>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">02</div>
            <h3>Build the solution</h3>
            <p>We review the risk, the asset, or the financing need and prepare a quote or a clear path to funding.</p>
          </div>
          <div class="step">
            <div class="step-num" aria-hidden="true">03</div>
            <h3>Stay with the same person</h3>
            <p>You receive a defined path — a quote, underwriting, or financing next steps — with Rasheed throughout.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <p class="eyebrow" style="justify-content:center">Begin a conversation</p>
        <h2>Ready to talk through coverage or capital?</h2>
        <p>Book a 30-minute intro call, or send a few details and we will follow up.</p>
        <div class="hero-actions" style="justify-content:center">
          <a class="btn btn-gold" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
          <a class="btn btn-ghost" href="get-started.html">Get Started</a>
        </div>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "contact.html",
  html: layout({
    title: "Contact | Wellesley Collective",
    path: "contact.html",
    description: "Contact Wellesley Collective about insurance, life insurance, annuities, or commercial financing.",
    current: "contact",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "City skyline at dusk", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Contact</p>
        <h1>Tell us what you need. We will take it from there.</h1>
        <p class="lede">Share a few details and a member of the Wellesley team will follow up.</p>
      </div>
    </section>
    <section class="section">
      <div class="container quote-layout">
        <div>
          <p class="kicker">Reach the firm</p>
          <h2>We’ll get back to you promptly.</h2>
          <p class="subhead">Call, email, or use this form for general questions or to decide where to start.</p>
          <div class="contact-direct mt-32">
            <p class="card-tag">Call or email</p>
            <p class="contact-phone"><a href="tel:${FIRM_TEL}">${FIRM_PHONE}</a></p>
            <p class="contact-email"><a href="mailto:${FIRM_EMAIL}">${FIRM_EMAIL}</a></p>
          </div>
          <div class="mt-32">
            <p class="card-tag">Typical inquiries</p>
            <ul class="feature-list">
              <li>Personal, commercial, or life insurance quotes</li>
              <li>Annuities, disability, and long-term care</li>
              <li>Working capital and commercial real estate financing</li>
            </ul>
          </div>
          <div class="hero-actions mt-32">
            <a class="btn btn-navy" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
          </div>
        </div>
        <div class="panel">${zohoForm()}</div>
      </div>
    </section>
    <section class="section section-cream">
      <div class="container">
        ${calendlyBlock()}
      </div>
    </section>`,
  }),
});

pages.push({
  file: "quote.html",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=get-started.html">
  <title>Get Started</title>
  <script>location.replace("get-started.html" + location.search + location.hash);</script>
</head>
<body>
  <p><a href="get-started.html">Continue to Get Started</a></p>
</body>
</html>
`,
});

pages.push({
  file: "get-started.html",
  html: layout({
    title: "Get Started | Wellesley Collective",
    path: "get-started.html",
    description: "Choose insurance, annuities, or commercial financing — then go to the right quote, or book a call.",
    current: "contact",
    extraScripts: ["js/start.js?v=1"],
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-commercial.jpg", alt: "Commercial building facade", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Get started</p>
        <h1 id="started-title">What do you need?</h1>
        <p class="lede" id="started-lede">Pick a path. We will send you to the right quote — or you can book a call instead.</p>
      </div>
    </section>
    <section class="section" id="start">
      <div class="container start-wrap">
        <form class="form intake-form start-path" data-start data-calendly="${CALENDLY_URL}" novalidate>
          <p class="kicker">A few questions</p>
          <h2 class="lead-heading">Tell us what you are here for.</h2>
          <p class="form-note">You can stop at any point and book a call.</p>

          <fieldset class="start-step">
            <legend>I need</legend>
            <select id="start-need" name="need">
              <option value="">Select</option>
              <option value="insurance">Insurance</option>
              <option value="annuities">Annuities / financial services</option>
              <option value="financing">Commercial financing</option>
              <option value="unsure">Not sure yet</option>
              <option value="call">Book a 30-minute call</option>
            </select>
          </fieldset>

          <fieldset class="start-step" data-panel="insurance" hidden>
            <legend>What kind of insurance?</legend>
            <select id="start-kind" name="kind">
              <option value="">Select</option>
              <option value="personal" data-href="intake/personal.html">Personal — home, auto, flood, umbrella</option>
              <option value="commercial" data-href="intake/commercial.html">Commercial — GL, BOP, workers’ comp, fleet</option>
              <option value="life" data-href="insurance/quote.html">Life insurance — term, whole life, UL</option>
            </select>
          </fieldset>

          <fieldset class="start-step" data-panel="personal" hidden>
            <legend>Which personal coverage, if you know?</legend>
            <select id="start-personal-line" name="personal_line">
              ${startLineOptions(personalLines, "intake/personal.html")}
            </select>
          </fieldset>

          <fieldset class="start-step" data-panel="commercial" hidden>
            <legend>Which commercial coverage, if you know?</legend>
            <select id="start-commercial-line" name="commercial_line">
              ${startLineOptions(commercialLines, "intake/commercial.html")}
            </select>
          </fieldset>

          <fieldset class="start-step" data-panel="life" hidden>
            <legend>How do you want to handle life insurance?</legend>
            <select id="start-life-line" name="life_line">
              ${startLineOptions(
                lifeProducts.map((item) => ({
                  ...item,
                  startHref: item.kind === "disability" || item.kind === "ltc" ? "intake/personal.html" : "insurance/quote.html",
                })),
                "insurance/quote.html",
                [
                  { value: "", href: "insurance/quote.html", label: "Quote myself online" },
                  { value: "details", href: "intake/personal.html", label: "Send details instead" },
                ]
              )}
            </select>
          </fieldset>

          <p class="form-note" data-start-status></p>
          <div class="hero-actions start-actions">
            <button class="btn btn-gold" type="submit" data-start-go>Continue</button>
            <a class="btn btn-outline" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
          </div>
          <p class="disclaimer">This does not bind coverage or guarantee financing. Name and email are enough once you reach a quote form.</p>

          <div hidden data-slug-map>
            ${annuityLines.map((item) => `<option data-slug="${esc(item.slug)}" data-need="annuities"></option>`).join("")}
            ${loanProducts.map((item) => `<option data-slug="${esc(item.slug)}" data-need="financing"></option>`).join("")}
          </div>
        </form>

        <div class="panel start-talk" id="talk" data-panel="talk" hidden>
          <p class="card-tag">Next</p>
          <h2 class="lead-heading" data-talk-title>Tell us what you need.</h2>
          <p class="form-note">A few details are enough. Or skip this and book a call.</p>
          ${zohoForm()}
          <div class="hero-actions mt-32">
            <a class="btn btn-navy" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-cream" id="call">
      <div class="container">
        ${calendlyBlock()}
      </div>
    </section>`,
  }),
});

pages.push({
  file: "intake/personal.html",
  html: intakePage({
    kind: "personal",
    title: "Personal insurance intake",
    description: "Start a personal insurance quote with Wellesley Collective. Only name and email are required.",
    lede: "Home, auto, flood, umbrella, watercraft, and life. Name and email are enough to start. The rest helps us quote.",
    who: "Households that need a personal or life insurance quote and want to send details — and optional documents — in one place.",
    coverages: [...personalLines, ...lifeProducts],
    extraFields: `
          <h3 class="intake-h">Property</h3>
          <div class="field"><label for="intake-address">Property address</label><input id="intake-address" name="property_address" autocomplete="street-address"></div>
          <div class="form-row">
            <div class="field"><label for="intake-occupancy">Occupancy</label>
              <select id="intake-occupancy" name="occupancy">
                <option value="">Select</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary / seasonal</option>
                <option value="Rental">Rental</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <div class="field"><label for="intake-year-built">Year built</label><input id="intake-year-built" name="year_built" inputmode="numeric"></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="intake-construction">Construction</label><input id="intake-construction" name="construction" placeholder="Frame, masonry, etc."></div>
            <div class="field"><label for="intake-dwelling">Rebuild / dwelling amount</label><input id="intake-dwelling" name="dwelling_limit"></div>
          </div>
          <h3 class="intake-h">Auto</h3>
          <div class="form-row">
            <div class="field"><label for="intake-vehicles">Number of vehicles</label><input id="intake-vehicles" name="vehicles" inputmode="numeric"></div>
            <div class="field"><label for="intake-drivers">Drivers in household</label><input id="intake-drivers" name="drivers" inputmode="numeric"></div>
          </div>
          <div class="field"><label for="intake-vins">VINs or vehicle descriptions</label><textarea id="intake-vins" name="vins" rows="3" placeholder="Year, make, model, or 17-character VIN"></textarea></div>
          <h3 class="intake-h">Life</h3>
          <div class="form-row">
            <div class="field"><label for="intake-dob">Date of birth</label><input id="intake-dob" name="date_of_birth" placeholder="MM/DD/YYYY"></div>
            <div class="field"><label for="intake-face">Coverage amount sought</label><input id="intake-face" name="life_amount" placeholder="$500,000"></div>
          </div>
          <h3 class="intake-h">Current insurance</h3>
          <div class="form-row">
            <div class="field"><label for="intake-carrier">Current carrier</label><input id="intake-carrier" name="current_carrier"></div>
            <div class="field"><label for="intake-exp">Expiration / renewal</label><input id="intake-exp" name="expiration" placeholder="MM/DD/YYYY"></div>
          </div>
          <div class="field"><label for="intake-premium">Current premium</label><input id="intake-premium" name="current_premium"></div>
        `,
  }),
});

pages.push({
  file: "intake/commercial.html",
  html: intakePage({
    kind: "commercial",
    title: "Commercial insurance intake",
    description: "Start a commercial insurance quote with Wellesley Collective. Only name and email are required.",
    lede: "GL, BOP, workers’ comp, fleet, property, cyber, and contractors. Name and email are enough to start. The rest helps us quote.",
    who: "Business owners and contractors who want to send operations details — and optional loss runs or declarations — for a commercial quote.",
    coverages: commercialLines,
    extraFields: `
          <h3 class="intake-h">The business</h3>
          <div class="form-row">
            <div class="field"><label for="intake-entity">Entity type</label>
              <select id="intake-entity" name="entity_type">
                <option value="">Select</option>
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Partnership">Partnership</option>
                <option value="Sole proprietor">Sole proprietor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="field"><label for="intake-years">Years in business</label><input id="intake-years" name="years_in_business" inputmode="numeric"></div>
          </div>
          <div class="field"><label for="intake-ops">Operations / class of work</label><textarea id="intake-ops" name="operations" rows="3" placeholder="What the company actually does, job-site vs shop, who the customers are."></textarea></div>
          <div class="form-row">
            <div class="field"><label for="intake-employees">Employees</label><input id="intake-employees" name="employees" inputmode="numeric"></div>
            <div class="field"><label for="intake-payroll">Annual payroll</label><input id="intake-payroll" name="payroll"></div>
          </div>
          <div class="form-row">
            <div class="field"><label for="intake-revenue">Annual revenue</label><input id="intake-revenue" name="revenue"></div>
            <div class="field"><label for="intake-locations">Locations</label><input id="intake-locations" name="locations" placeholder="Number of locations or addresses"></div>
          </div>
          <div class="field"><label for="intake-website">Website</label><input id="intake-website" name="website" inputmode="url"></div>
          <h3 class="intake-h">Autos, property, and claims</h3>
          <div class="form-row">
            <div class="field"><label for="intake-fleet">Fleet / work vehicles</label><input id="intake-fleet" name="fleet_count" inputmode="numeric"></div>
            <div class="field"><label for="intake-sub">Subcontractors</label><input id="intake-sub" name="subcontractors" placeholder="Yes / no, or % of work"></div>
          </div>
          <div class="field"><label for="intake-cvins">VINs or unit descriptions</label><textarea id="intake-cvins" name="vins" rows="3"></textarea></div>
          <div class="field"><label for="intake-bldg">Buildings / contents values</label><textarea id="intake-bldg" name="property_values" rows="3"></textarea></div>
          <div class="form-row">
            <div class="field"><label for="intake-ccarrier">Current carrier</label><input id="intake-ccarrier" name="current_carrier"></div>
            <div class="field"><label for="intake-cexp">Expiration / renewal</label><input id="intake-cexp" name="expiration"></div>
          </div>
          <div class="field"><label for="intake-claims">Claims in the last 5 years</label><textarea id="intake-claims" name="claims" rows="3"></textarea></div>
        `,
  }),
});

pages.push({
  file: "rates.html",
  html: layout({
    title: "Market Rates | Wellesley Collective",
    path: "rates.html",
    description: "Live federal funds, SOFR, prime, Treasury par yields, and mortgage rates from FRED and the U.S. Treasury.",
    current: "rates",
    extraScripts: ["js/rates.js?v=1"],
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "Evening city skyline over a commercial district", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Market rates</p>
        <h1>Published rates, pulled when you open the page.</h1>
        <p class="lede">Federal funds, SOFR, prime, the Treasury par yield curve, and mortgage averages. These are market series — not a Wellesley quote or a commitment to lend.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#rates">View rates</a>
          <a class="btn btn-ghost" href="get-started.html">Talk with the firm</a>
        </div>
      </div>
    </section>
    ${whoBlock("Anyone pricing a loan, a refinance, or a policy who wants the current published backdrop before a conversation.")}
    <section class="section" id="rates">
      <div class="container" id="rates-dashboard">
        <div class="rates-toolbar">
          <p class="form-note" id="rates-status">Loading live series…</p>
          <button class="btn btn-outline" type="button" id="rates-refresh">Refresh</button>
        </div>

        <div class="section-head">
          <p class="kicker">Central bank rates</p>
          <h2>Policy and overnight funding.</h2>
        </div>
        <div class="rate-grid">
          <article class="rate-card is-fallback" data-rate="FEDFUNDS">
            <p class="card-tag">FRED · FEDFUNDS</p>
            <h3>Federal Funds Rate</h3>
            <p class="rate-value">3.62%</p>
            <p class="rate-meta">Fallback · as of Jul 31, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="SOFR">
            <p class="card-tag">FRED · SOFR</p>
            <h3>SOFR</h3>
            <p class="rate-value">3.66%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="DPRIME">
            <p class="card-tag">FRED · DPRIME</p>
            <h3>Bank Prime Loan Rate</h3>
            <p class="rate-value">6.50%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
        </div>

        <div class="section-head mt-32">
          <p class="kicker">Treasury yield curve</p>
          <h2>Par yields from one month to 30 years.</h2>
          <p id="curve-meta">Published fallbacks · as of Aug 28, 2026</p>
        </div>
        <div class="curve-board" aria-hidden="true">
          ${[
            ["YC_1M", "1M"],
            ["YC_3M", "3M"],
            ["YC_6M", "6M"],
            ["YC_1Y", "1Y"],
            ["YC_2Y", "2Y"],
            ["YC_5Y", "5Y"],
            ["YC_10Y", "10Y"],
            ["YC_30Y", "30Y"],
          ]
            .map(
              ([key, label]) => `
            <div class="curve-col" data-curve="${key}">
              <div class="curve-bar"><span class="curve-fill"></span></div>
              <p class="curve-rate">—</p>
              <p class="curve-tenor">${label}</p>
            </div>`
            )
            .join("")}
        </div>
        <div class="rate-grid">
          <article class="rate-card is-fallback" data-rate="YC_1M">
            <p class="card-tag">1-Month</p>
            <h3>Treasury par yield</h3>
            <p class="rate-value">3.84%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="YC_3M">
            <p class="card-tag">3-Month</p>
            <h3>Treasury par yield</h3>
            <p class="rate-value">3.90%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="YC_6M">
            <p class="card-tag">6-Month</p>
            <h3>Treasury par yield</h3>
            <p class="rate-value">4.02%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="YC_1Y">
            <p class="card-tag">1-Year</p>
            <h3>Treasury par yield</h3>
            <p class="rate-value">4.15%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="YC_2Y">
            <p class="card-tag">2-Year</p>
            <h3>Treasury par yield</h3>
            <p class="rate-value">4.34%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="DGS5">
            <p class="card-tag">FRED · DGS5</p>
            <h3>5-Year Treasury</h3>
            <p class="rate-value">4.48%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="DGS10">
            <p class="card-tag">FRED · DGS10</p>
            <h3>10-Year Treasury</h3>
            <p class="rate-value">4.73%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="DGS30">
            <p class="card-tag">FRED · DGS30</p>
            <h3>30-Year Treasury</h3>
            <p class="rate-value">5.22%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
        </div>

        <div class="section-head mt-32">
          <p class="kicker">Consumer / mortgage rates</p>
          <h2>Home-loan averages and corporate credit.</h2>
        </div>
        <div class="rate-grid">
          <article class="rate-card is-fallback" data-rate="MORTGAGE30US">
            <p class="card-tag">FRED · MORTGAGE30US</p>
            <h3>30-Year Fixed Mortgage</h3>
            <p class="rate-value">6.35%</p>
            <p class="rate-meta">Fallback · as of Aug 20, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="MORTGAGE15US">
            <p class="card-tag">FRED · MORTGAGE15US</p>
            <h3>15-Year Fixed Mortgage</h3>
            <p class="rate-value">5.72%</p>
            <p class="rate-meta">Fallback · as of Aug 20, 2026</p>
          </article>
          <article class="rate-card is-fallback" data-rate="BAMLC0A4CBBB">
            <p class="card-tag">FRED · BAMLC0A4CBBB</p>
            <h3>Corporate BBB Spot Yield</h3>
            <p class="rate-value">5.88%</p>
            <p class="rate-meta">Fallback · as of Aug 28, 2026</p>
          </article>
        </div>
        <p class="disclaimer mt-32">Sources: Federal Reserve Bank of St. Louis (FRED) and the U.S. Department of the Treasury. Series can lag, revise, or fail to load; fallback values are shown when a request times out. These figures are not an offer of credit, a lock, or an insurance quote. Your rate depends on credit, collateral, occupancy, and underwriting.</p>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "resources/index.html",
  html: layout({
    title: "Resource Center | Wellesley Collective",
    description: "All Wellesley Collective client tools in one place: flood zone, property risk, VIN, entity lookup, DSCR, SBA, longevity, and inflation.",
    root: "../",
    path: "resources/index.html",
    current: "resources",
    extraScripts: [],
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "Evening city skyline over a commercial district", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Client Resource Center</p>
        <h1>Eight tools. One desk.</h1>
        <p class="lede">Property, business, and life — grouped here so nothing is scattered around the site. Each tool can hand off to a quote or a call. None of them is a quote or a credit decision.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#tools">See all tools</a>
          <a class="btn btn-ghost" href="../get-started.html">Get Started</a>
        </div>
      </div>
    </section>
    ${whoBlock("Homeowners checking flood maps, operators confirming the legal entity, borrowers running DSCR, and households sizing retirement income — before a formal application.")}

    <section class="section section-cream" id="tools">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Directory</p>
          <h2>Find the tool, then run it below.</h2>
        </div>
        <div class="tool-desks">
          ${toolDesk("Property & vehicles", "Insurance files that start with a place or a vehicle.", [
            { id: "flood", name: "Flood zone lookup", blurb: "FEMA NFHL zone and a flood-quote handoff." },
            { id: "risk", name: "Property risk checker", blurb: "NWS alerts and USGS seismic history." },
            { id: "vin", name: "VIN decoder", blurb: "NHTSA year, make, model, then the right auto form." },
          ])}
          ${toolDesk("Business & capital", "Commercial insurance and financing, before the application.", [
            { id: "entity", name: "Entity lookup", blurb: "Legal name, status, type — then the commercial quote." },
            { id: "dscr", name: "DSCR calculator", blurb: "NOI versus annual debt service, live." },
            { id: "sba", name: "SBA 7(a) / 504 snapshot", blurb: "Program limits, guaranty, and typical terms." },
          ])}
          ${toolDesk("Life & money", "Longevity, income, and cash sitting still.", [
            { id: "longevity", name: "Longevity & income gap", blurb: "SSA life table versus the paycheck you want." },
            { id: "inflation", name: "Inflation calculator", blurb: "BLS CPI-U and what uninvested cash is worth." },
          ])}
        </div>
      </div>
    </section>

    <section class="section tool-group" id="property">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Property &amp; vehicles</p>
          <h2>Start with the address or the VIN.</h2>
        </div>
      </div>
    </section>
    ${toolBlock({
      id: "flood",
      kicker: "Property insurance",
      title: "FEMA flood zone lookup.",
      subhead: "Enter a property address. We geocode it and read the FEMA National Flood Hazard Layer for the effective flood zone — then send you to a flood quote if you want one.",
      fields: `<div class="field">
              <label for="flood-address">Property address or ZIP</label>
              <input id="flood-address" name="address" required placeholder="200 E Las Olas Blvd, Fort Lauderdale, FL">
            </div>`,
      note: "FEMA NFHL. A street address is tighter than a ZIP centroid.",
      button: "Look up flood zone",
    })}
    ${toolBlock({
      id: "risk",
      kicker: "Property",
      title: "Commercial &amp; personal property risk checker.",
      subhead: "Enter a ZIP or street address. We geocode it, pull active National Weather Service alerts, and look up USGS earthquake history within 100 miles.",
      fields: `<div class="field">
              <label for="risk-location">ZIP code or street address</label>
              <input id="risk-location" name="location" required placeholder="33101 or 200 E Las Olas Blvd, Fort Lauderdale, FL">
            </div>`,
      note: "NWS + USGS. Flood-zone maps are the tool above.",
      button: "Check local risk",
      cream: true,
    })}
    ${toolBlock({
      id: "vin",
      kicker: "Auto &amp; fleet",
      title: "VIN decoder for personal auto and commercial fleet.",
      subhead: "Paste a 17-character VIN. NHTSA VPIC returns year, make, model, body class, vehicle type, drive type, fuel, and displacement — then we route you to the right quote form.",
      fields: `<div class="field">
              <label for="vin-input">Vehicle identification number</label>
              <input id="vin-input" name="vin" required maxlength="17" autocomplete="off" placeholder="1HGCM82633A004352" spellcheck="false">
            </div>`,
      note: "Decodes as you finish the 17th character, or on submit.",
      button: "Decode VIN",
    })}

    <section class="section tool-group section-cream" id="business">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Business &amp; capital</p>
          <h2>Confirm the entity. Then stress the numbers.</h2>
        </div>
      </div>
    </section>
    ${toolBlock({
      id: "entity",
      kicker: "Commercial lines",
      title: "Corporate entity lookup.",
      subhead: "Enter the company name and state. We look up registry status, entity type, and registration year, then put the official name on the commercial quote form.",
      fields: `<div class="form-row">
              <div class="field">
                <label for="entity-company">Company name</label>
                <input id="entity-company" name="company" required placeholder="Legal name as filed">
              </div>
              <div class="field">
                <label for="entity-state">State of formation</label>
                <select id="entity-state" name="state" required>
                  <option value="">Select</option>
                  ${["FL", "CA", "CO", "DE", "MD", "MI", "NJ", "OH", "OR", "PA", "TX", "VA", "WA"].map((st) => `<option value="${st}">${st}</option>`).join("")}
                  <option value="NY">NY</option>
                  <option value="GA">GA</option>
                  <option value="NC">NC</option>
                  <option value="IL">IL</option>
                </select>
              </div>
            </div>`,
      note: "Public company registries. Confirm against the secretary of state printout before binding.",
      button: "Look up entity",
    })}
    ${toolBlock({
      id: "dscr",
      kicker: "Commercial financing",
      title: "DSCR &amp; coverage calculator.",
      subhead: "Annual net operating income divided by annual principal and interest. The ratio updates as you type. Not a credit decision.",
      fields: `<div class="form-row">
              <div class="field">
                <label for="dscr-noi">Annual net operating income (NOI)</label>
                <input id="dscr-noi" name="noi" inputmode="decimal" required placeholder="240000">
              </div>
              <div class="field">
                <label for="dscr-debt">Annual debt service (principal + interest)</label>
                <input id="dscr-debt" name="debt" inputmode="decimal" required placeholder="180000">
              </div>
            </div>`,
      note: "< 1.15x high risk · 1.20x–1.35x standard fit · > 1.35x strong.",
      button: "Calculate DSCR",
      cream: true,
    })}
    ${toolBlock({
      id: "sba",
      kicker: "Commercial financing",
      title: "SBA 7(a) / 504 feasibility snapshot.",
      subhead: "Enter an amount and use of funds. We apply published SBA program limits, guaranty percentages, illustrative fees, typical terms, and a common DSCR starting point. Not a credit decision.",
      fields: `<div class="form-row">
              <div class="field">
                <label for="sba-amount">Requested amount</label>
                <input id="sba-amount" name="amount" type="number" min="25000" step="5000" required placeholder="1250000">
              </div>
              <div class="field">
                <label for="sba-purpose">Use of funds</label>
                <select id="sba-purpose" name="purpose">
                  <option value="wc">Working capital</option>
                  <option value="equipment">Equipment</option>
                  <option value="cre" selected>Owner-occupied commercial real estate</option>
                </select>
              </div>
            </div>`,
      note: "Published SBA 7(a) and 504 program rules as of July 4, 2026.",
      button: "Run feasibility",
    })}

    <section class="section tool-group" id="life-money">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Life &amp; money</p>
          <h2>How long the checks have to last — and what cash is doing.</h2>
        </div>
      </div>
    </section>
    ${toolBlock({
      id: "longevity",
      kicker: "Life &amp; annuities",
      title: "SSA longevity &amp; income gap planner.",
      subhead: "Current age, gender, and the monthly income you want. We use SSA period life table remaining expectancy to size the horizon, then show the gap versus income you already expect.",
      fields: `<div class="form-row">
              <div class="field">
                <label for="longevity-age">Current age</label>
                <input id="longevity-age" name="age" inputmode="numeric" required placeholder="58">
              </div>
              <div class="field">
                <label for="longevity-gender">Gender (SSA table)</label>
                <select id="longevity-gender" name="gender">
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="longevity-income">Desired monthly retirement income</label>
                <input id="longevity-income" name="income" inputmode="decimal" required placeholder="6000">
              </div>
              <div class="field">
                <label for="longevity-retire">Retirement age</label>
                <input id="longevity-retire" name="retire" inputmode="numeric" value="67" placeholder="67">
              </div>
            </div>
            <div class="field">
              <label for="longevity-have">Monthly income you already expect (optional)</label>
              <input id="longevity-have" name="have" inputmode="decimal" placeholder="Social Security, pension">
            </div>`,
      note: "SSA period life table, 2021. Averages, not a forecast of your life.",
      button: "Show the income gap",
      cream: true,
    })}
    <section class="section" id="inflation">
      <div class="container tool-layout">
        <div>
          <p class="kicker">Life &amp; annuities</p>
          <h2>Inflation and cash erosion calculator.</h2>
          <p class="subhead">Uses BLS CPI-U (CUUR0000SA0) for a trailing 12-month inflation rate, then shows what uninvested cash is worth in today’s dollars versus hypothetical fixed and indexed growth. Illustrations only.</p>
          <p class="form-note" id="cpi-rate">Loading CPI…</p>
          <form class="form tool-form" id="inflation-form">
            <div class="form-row">
              <div class="field">
                <label for="cash-input">Uninvested cash</label>
                <input id="cash-input" name="cash" type="number" min="1000" step="1000" required placeholder="250000">
              </div>
              <div class="field">
                <label for="years-input">Horizon</label>
                <select id="years-input" name="years">
                  <option value="10">10 years</option>
                  <option value="20" selected>20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
            </div>
            <p class="form-note" id="inflation-status">BLS public API.</p>
            <button class="btn btn-gold" type="submit">Show purchasing power</button>
          </form>
        </div>
        <div id="inflation-result" class="tool-output" hidden></div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container">
        <p class="eyebrow" style="justify-content:center">Need the file reviewed</p>
        <h2>Tools first. Then a person if you want one.</h2>
        <p>Send what you ran and we will tell you what, if anything, should change.</p>
        <div class="hero-actions" style="justify-content:center">
          <a class="btn btn-gold" href="../get-started.html">Get Started</a>
          <a class="btn btn-ghost" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
        </div>
      </div>
    </section>
    <script type="module" src="../js/resources/index.js?v=4"></script>`,
  }),
});

pages.push({
  file: "residential-mortgages.html",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=index.html">
  <title>Wellesley Collective</title>
  <script>location.replace("index.html" + location.search + location.hash);</script>
</head>
<body>
  <p><a href="index.html">Continue to Wellesley Collective</a></p>
</body>
</html>
`,
});

pages.push({
  file: "privacy.html",
  html: layout({
    title: "Privacy Policy | Wellesley Collective",
    description: "Privacy practices for Wellesley Collective.",
    current: "",
    content: `
    <section class="section">
      <div class="container" style="max-width:760px">
        <p class="kicker">Legal</p>
        <h1>Privacy Policy</h1>
        <p class="subhead">This website is operated by Wellesley Collective. We collect the information you submit through our forms — typically your name, email, phone number, and a description of your inquiry.</p>
        <p class="mt-16" style="color:var(--slate)">If you use an insurance intake form, we also collect the quote details you enter and any documents you attach so we can prepare a quote. Files are sent to our CRM and, when attached, to our firm email.</p>
        <p class="mt-16" style="color:var(--slate)">We use that information to respond to you and to quote or discuss the services you requested. We do not sell personal information.</p>
        <p class="mt-16" style="color:var(--slate)">For privacy questions, email <a href="mailto:${FIRM_EMAIL}">${FIRM_EMAIL}</a> or use the contact form on this website.</p>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "terms.html",
  html: layout({
    title: "Terms of Use | Wellesley Collective",
    description: "Terms of use for the Wellesley Collective website.",
    current: "",
    content: `
    <section class="section">
      <div class="container" style="max-width:760px">
        <p class="kicker">Legal</p>
        <h1>Terms of Use</h1>
        <p class="subhead">The materials on this website are for general information. They do not constitute an offer of insurance, a commitment to lend, legal advice, or a guarantee of any product, rate, or coverage term.</p>
        <p class="mt-16" style="color:var(--slate)">Any insurance policy or loan is subject to eligibility, underwriting, and documentation.</p>
        <p class="mt-16" style="color:var(--slate)">Content may change without notice. For a specific request, get started or contact us and speak with our team.</p>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "insurance/index.html",
  html: layout({
    title: "Insurance | Wellesley Collective",
    description: "Quote personal, commercial, and life insurance — term, whole life, universal life, final expense, disability, and long-term care — with Wellesley Collective.",
    root: "../",
    path: "insurance/index.html",
    current: "insurance",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-home.jpg", alt: "A well-kept home at dusk", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Insurance</p>
        <h1>Property, casualty, and life insurance — quoted by one licensed team.</h1>
        <p class="lede">We quote the actual policy — not a category. Personal lines, commercial lines, and life insurance, named the way you search for them. Annuities live under Financial Services.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="../intake/personal.html">Personal quote</a>
          <a class="btn btn-ghost" href="../intake/commercial.html">Commercial quote</a>
        </div>
      </div>
    </section>
    ${whoBlock("Homeowners, drivers, landlords, contractors, and business owners — plus families who need term, whole life, universal life, final expense, key-person, disability, or long-term care coverage.")}
    <section class="section" id="products">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Most requested</p>
          <h2>Start with the policy you actually need.</h2>
          <p>Six products people ask for first. Every other personal and commercial line is listed below.</p>
        </div>
        <div class="grid-3">${productCards(
          bySlug(
            [...commercialLines, ...personalLines],
            ["general-liability", "business-owners-policy", "workers-compensation", "commercial-auto", "cyber-liability", "homeowners-insurance"]
          ),
          "insurance",
          "Get Started",
          "../"
        )}</div>
      </div>
    </section>
    <section class="section section-cream anchor" id="personal">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Personal lines</p>
          <h2>Homeowners, auto, renters, condo, umbrella, watercraft, flood.</h2>
          <div class="hero-actions">
            <a class="btn btn-gold" href="../intake/personal.html">Start a personal quote</a>
          </div>
        </div>
        ${productIndex(personalLines, "insurance", "../")}
      </div>
    </section>
    <section class="section anchor" id="commercial">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Commercial lines</p>
          <h2>GL, property, commercial auto, WC, BOP, contractors, E&amp;O, inland marine, umbrella, cyber, flood.</h2>
          <div class="hero-actions">
            <a class="btn btn-gold" href="../intake/commercial.html">Start a commercial quote</a>
          </div>
        </div>
        ${productIndex(commercialLines, "insurance", "../")}
      </div>
    </section>
    <section class="section section-cream anchor" id="life">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Life insurance</p>
          <h2>Term, whole life, UL, final expense, key-person, disability, LTC.</h2>
          <p>Life insurance is insurance. We quote term, return-of-premium term, whole life, universal life, guaranteed and indexed UL, final expense, and key-person coverage. Impaired-risk and larger premium cases are in appetite. You can also quote yourself online. For fixed, indexed, and income annuities, see Financial Services.</p>
          <div class="hero-actions">
            <a class="btn btn-gold" href="quote.html">Get a life insurance quote</a>
            <a class="btn btn-outline" href="../financial-services/index.html">View annuities</a>
          </div>
        </div>
        <div class="grid-3">${productCards(
          bySlug(lifeProducts, [
            "term-life-insurance",
            "whole-life-insurance",
            "universal-life-insurance",
            "final-expense-insurance",
            "business-life-insurance",
            "disability-insurance",
          ]),
          "insurance",
          "Get Started",
          "../"
        )}</div>
        ${productIndex(lifeProducts, "insurance", "../")}
      </div>
    </section>
    ${relatedReading(
      guidesFor("term-vs-permanent-life", "homeowners-renewal-checklist", "annuity-types-explained"),
      "../"
    )}
    <div id="start">${convertBand({ root: "../", product: "Insurance", need: "insurance" })}</div>`
  }),
});

pages.push({
  file: "financial-services/index.html",
  html: layout({
    title: "Financial Services | Wellesley Collective",
    description: "Fixed, indexed, and income annuities from Wellesley Collective — MYGAs, SPIAs, and DIAs for accumulation and lifetime income.",
    root: "../",
    path: "financial-services/index.html",
    current: "financial",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "Evening city skyline over a commercial district", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Financial Services</p>
        <h1>Fixed, indexed, and income annuities.</h1>
        <p class="lede">Annuities are a different job from life insurance. These contracts are for a stated rate, a floor under savings, or a paycheck you cannot outlive.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#start">Get Started</a>
          <a class="btn btn-ghost" href="#products">View products</a>
        </div>
      </div>
    </section>
    ${whoBlock("Retirees and pre-retirees who want a known rate, a floor against market loss, or contractual income — and who can live with limited liquidity during the surrender period.")}
    <section class="section" id="products">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Annuities</p>
          <h2>Match the contract to the job.</h2>
          <p>MYGAs and declared-rate contracts, indexed annuities, and SPIAs or DIAs. Life insurance, including term and whole life, stays under Insurance.</p>
        </div>
        <div class="grid-3">${productCards(annuityLines, "financial-services", "Get Started", "../")}</div>
        ${productIndex(annuityLines, "financial-services", "../")}
      </div>
    </section>
    ${relatedReading(guidesFor("annuity-types-explained", "term-vs-permanent-life"), "../")}
    <div id="start">${convertBand({ root: "../", product: "Annuities", need: "annuities" })}</div>`
  }),
});

pages.push({
  file: "insurance/quote.html",
  html: layout({
    title: "Life Insurance Quote | Wellesley Collective",
    description: "Get a life insurance quote online — term, whole life, universal life, final expense, and related products. Apply yourself or talk with Wellesley Collective.",
    root: "../",
    path: "insurance/quote.html",
    current: "insurance",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-home.jpg", alt: "A well-kept home at dusk", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Life insurance</p>
        <h1>Get a life insurance quote.</h1>
        <p class="lede">This is for you to run. Answer a few questions, compare options, and apply online if you want to. If you would rather talk first, book a call or leave your details.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#quote">Start a quote</a>
          <a class="btn btn-ghost" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
        </div>
      </div>
    </section>
    ${whoBlock("People who want term, whole life, universal life, final expense, or related life coverage and would like to see numbers before talking to an agent — or who want to apply online now.")}
    <section class="section" id="quote">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Quote yourself</p>
          <h2>See options in a few minutes.</h2>
          <p>Use the form below. Coverage still has to be underwritten. If something looks off or you want a second set of eyes, we will review it.</p>
        </div>
        ${quoteApplyEmbed()}
      </div>
    </section>
    <section class="section section-cream">
      <div class="container quote-layout">
        <div>
          <p class="kicker">Prefer a person</p>
          <h2>We will follow up within one business day.</h2>
          <p class="subhead">Annuities, key-person, buy-sell, disability, and some larger or impaired-risk cases are often cleaner with a conversation.</p>
          <div class="hero-actions mt-32">
            <a class="btn btn-navy" href="${CALENDLY_URL}" target="_blank" rel="noopener">Book a call</a>
            <a class="btn btn-outline" href="../contact.html">Contact us</a>
          </div>
        </div>
        <div class="panel">${leadForm({ root: "../", product: "Life insurance quote", need: "life" })}</div>
      </div>
    </section>`,
  }),
});

pages.push({
  file: "commercial-loans/index.html",
  html: layout({
    title: "Commercial Financing | Wellesley Collective",
    description: "Apply for working capital, equipment, ABL, lines of credit, CRE, bridge, construction, and SBA financing with Wellesley Collective.",
    root: "../",
    path: "commercial-loans/index.html",
    current: "loans",
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-commercial.jpg", alt: "Commercial campus at twilight", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Commercial Financing</p>
        <h1>Working capital, equipment, CRE, SBA, bridge, and lines of credit.</h1>
        <p class="lede">Named products for operators and commercial property investors — not a generic “business loan” page.</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="#start">Apply Now</a>
          <a class="btn btn-ghost" href="#products">View products</a>
        </div>
      </div>
    </section>
    ${whoBlock("Business owners and CRE investors who need a specific facility: working capital, equipment financing, a line of credit, ABL, a commercial real estate loan, a bridge, construction funds, or an SBA 7(a) or 504.")}
    <section class="section" id="products">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Most requested</p>
          <h2>Six facilities people apply for first.</h2>
          <p>Every commercial financing product we handle is listed below.</p>
        </div>
        <div class="grid-3">${productCards(
          bySlug(loanProducts, [
            "working-capital",
            "equipment-financing",
            "commercial-real-estate",
            "sba-loans",
            "business-lines-of-credit",
            "bridge-financing",
          ]),
          "commercial-loans",
          "Apply Now",
          "../"
        )}</div>
      </div>
    </section>
    <section class="section section-cream">
      <div class="container">
        <div class="section-head">
          <p class="kicker">All commercial financing</p>
          <h2>Working capital, equipment, ABL, LOC, unsecured term, CRE, bridge, construction, SBA.</h2>
        </div>
        ${productIndex(loanProducts, "commercial-loans", "../")}
        <p class="disclaimer mt-32">Any loan is subject to credit approval, eligibility, and documentation.</p>
      </div>
    </section>
    ${relatedReading(
      guidesFor("bridge-vs-permanent-cre", "sba-7a-what-lenders-review", "working-capital-vs-line-of-credit"),
      "../"
    )}
    <div id="start">${convertBand({ root: "../", product: "Commercial Financing", need: "financing" })}</div>`
  }),
});

function productPage({ item, folder, current, eyebrow, cta, siblingLabel, siblings, relatedExtra = [], image, need = "", guides = [], quoteHref = "", intakeHref = "" }) {
  const root = "../";
  const related = pickRelated(item, siblings, relatedExtra, 6);
  const primaryHref = quoteHref || intakeHref || "#start";
  const primaryLabel = quoteHref ? "Get a quote" : intakeHref ? "Start a quote" : cta;
  const quotePanel = quoteHref
    ? `<div class="quote-cta-panel">
        <p class="card-tag">Quote yourself</p>
        <h3 class="lead-heading">Get a life insurance quote now.</h3>
        <p>Answer a few questions and see options. You can apply online or stop and talk with us.</p>
        <a class="btn btn-gold" href="${quoteHref}">Get a quote</a>
        <p class="form-note">Prefer we follow up instead? Use the form below.</p>
      </div>`
    : intakeHref
      ? `<div class="quote-cta-panel">
        <p class="card-tag">Quote</p>
        <h3 class="lead-heading">Send what we need to quote.</h3>
        <p>Name and email are enough. Add property, vehicles, operations, and documents if you have them.</p>
        <a class="btn btn-gold" href="${intakeHref}">Start a quote</a>
        <p class="form-note">Prefer a short message instead? Use the form below.</p>
      </div>`
    : "";
  return layout({
    title: `${item.name} | Wellesley Collective`,
    description: item.summary,
    root,
    path: `${folder}/${item.slug}.html`,
    current,
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: `assets/images/${image}`, alt: `${item.name} — Wellesley Collective`, root, lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1>${productTitle(item)}</h1>
        <p class="lede">${esc(item.summary)}</p>
        <div class="hero-actions">
          <a class="btn btn-gold" href="${primaryHref}">${esc(primaryLabel)}</a>
          <a class="btn btn-ghost" href="#related">Related products</a>
        </div>
      </div>
    </section>
    ${whoBlock(item.who.join(" · "))}
    <section class="section">
      <div class="container product-layout">
        <div>
          <div class="breadcrumb">
            <a href="${root}index.html">Home</a>
            <span>/</span>
            <a href="${root}${folder}/index.html">${esc(siblingLabel)}</a>
            <span>/</span>
            <span>${esc(item.name)}</span>
          </div>
          <p class="plain-callout">${esc(item.simple)}</p>
          <h2>How it works</h2>
          <p class="mt-16 product-prose">${esc(item.details)}</p>
          <div class="explain-grid">
            <div class="explain-card">
              <p class="card-tag">Who this is for</p>
              <ul class="feature-list">${item.who.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
            </div>
            <div class="explain-card">
              <p class="card-tag">What it typically covers</p>
              <ul class="feature-list">${item.covers.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
            </div>
          </div>
          <div class="example-box">
            <p class="card-tag">A simple example</p>
            <p>${esc(item.example)}</p>
          </div>
          <div class="notes-box">
            <p class="card-tag">Good to know</p>
            <ul class="feature-list">${item.notes.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </div>
          <p class="disclaimer mt-32">${
            item.kind === "annuity"
              ? "Annuities are insurance contracts, not bank deposits and not FDIC insured. Guarantees depend on the issuing insurer. Surrender charges, limited liquidity, and tax on gains can apply. This is not investment, tax, or legal advice."
              : item.kind
                ? "Coverage, eligibility, premiums, and underwriting vary by age, health, state, and carrier. Illustrations are not guarantees. This is not tax, legal, or investment advice."
                : "Coverage, eligibility, and terms vary by location and underwriting."
          }</p>
        </div>
        <aside class="panel sticky-card" id="start">
          ${quotePanel}
          ${leadForm({ root, product: item.name, need })}
        </aside>
      </div>
    </section>
    <section class="section section-cream" id="related">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Related products</p>
          <h2>Other policies and facilities people pair with this.</h2>
        </div>
        <div class="grid-3">
          ${related
            .map(
              (other) => `
            <article class="product-card">
              <h3>${productTitle(other)}</h3>
              <p class="who-line">${esc(whoLine(other))}</p>
              <p>${esc(other.summary)}</p>
              <a class="btn btn-outline" href="${other.folder ? `${root}${other.folder}/${other.slug}.html` : `${other.slug}.html`}">View details</a>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>
    ${relatedReading(guides, root)}`,
  });
}

function insightPage({ slug, title, description, kicker, date, lede, body, ctaLabel, ctaHref }) {
  return layout({
    title: `${title} | Wellesley Collective`,
    description,
    root: "../",
    path: `blog/${slug}.html`,
    current: "blog",
    content: `
    <section class="section" style="padding-top:56px">
      <div class="container article-wrap">
        <div class="breadcrumb">
          <a href="../index.html">Home</a>
          <span>/</span>
          <a href="index.html">Blog</a>
          <span>/</span>
          <span>${esc(title)}</span>
        </div>
        <p class="kicker">${esc(kicker)}</p>
        <h1>${esc(title)}</h1>
        <p class="article-meta">${esc(date)} · Wellesley Insights</p>
        <p class="lede" style="color:var(--slate);max-width:68ch">${esc(lede)}</p>
        <div class="article-body">
          ${body}
        </div>
        <div class="panel mt-32">
          <p class="card-tag">Talk with the firm</p>
          <h3 style="font-family:var(--font-serif);font-size:28px;font-weight:500;color:var(--navy);margin:8px 0 12px">Want this applied to your situation?</h3>
          <p style="color:var(--slate);margin-bottom:18px">We will review your coverage or financing picture and tell you what, if anything, should change.</p>
          <a class="btn btn-gold" href="${ctaHref}">${esc(ctaLabel)}</a>
        </div>
      </div>
    </section>`,
  });
}

const archivePosts = [
  {
    month: "January 2026",
    slug: "january-fed-holds-first-meeting",
    title: "The Fed’s first 2026 decision: rates stay put.",
    kicker: "Rates & Economy",
    date: "January 28, 2026",
    summary: "The FOMC opened the year by holding the federal funds rate at 3.50%–3.75% after three cuts in late 2025.",
    description: "What the Federal Reserve’s January 28, 2026 rate hold meant for mortgages, credit cards, and business loans.",
    lede: "The first Fed meeting of 2026 did not deliver another cut. After three reductions at the end of 2025, the Committee held the federal funds rate at 3.50% to 3.75%.",
    ctaLabel: "Discuss financing",
    ctaHref: "../get-started.html",
    body: `
      <p>On January 28, <a href="https://www.cnbc.com/2026/01/28/fed-decision-mortgage-rates-credit-cards-loans.html" target="_blank" rel="noopener">CNBC reported</a> that the Federal Reserve left its benchmark rate unchanged at the first policy decision of the year. That followed 75 basis points of cuts in September, October, and December 2025.</p>
      <p>A hold does not freeze household or business borrowing costs. Credit cards, auto loans, and many commercial facilities still reprice off prime and market yields. Mortgage rates had already started the year lower than a year earlier — around 6.15% on a 30-year fixed, versus more than 7% in early 2025 — but they were not falling just because the Fed sat still.</p>
      <h2>What it meant then — and still means</h2>
      <p>January was the first signal that 2026 would be a “wait and see” year, not a repeat of the late-2025 cutting cycle. If you were shopping a purchase, refinance, equipment loan, or line of credit, the right move was to price the payment you could live with at then-current rates, not at a hoped-for spring cut.</p>
      <p class="article-sources"><strong>Sources:</strong> CNBC (Jan. 28, 2026); Federal Reserve FOMC.</p>
    `,
  },
  {
    month: "January 2026",
    slug: "january-fannie-freddie-mbs",
    title: "Fannie and Freddie were directed to buy $200 billion in mortgage bonds.",
    kicker: "For Homeowners",
    date: "January 9, 2026",
    summary: "A January directive for Fannie Mae and Freddie Mac to buy mortgage-backed securities briefly pulled 30-year rates lower.",
    description: "How the January 2026 Fannie Mae and Freddie Mac MBS purchase directive affected mortgage rates.",
    lede: "To pressure home-loan rates lower, the administration directed Fannie Mae and Freddie Mac to buy $200 billion in mortgage-backed bonds. Rates dipped. Most existing borrowers still had no reason to refinance.",
    ctaLabel: "Review homeowners coverage",
    ctaHref: "../intake/personal.html?product=homeowners-insurance",
    body: `
      <p>In early January, President Trump said Fannie Mae and Freddie Mac should buy $200 billion in mortgage-backed bonds to help lower home-loan rates. <a href="https://www.cnbc.com/2026/01/28/fed-decision-mortgage-rates-credit-cards-loans.html" target="_blank" rel="noopener">CNBC noted</a> that the average 30-year fixed rate sank briefly on the news and was near 6.15% later that month, down from more than 7% a year earlier.</p>
      <p>The Fed’s January minutes later confirmed the market reaction: MBS yields fell relative to Treasuries after the announcement. Policymakers also observed that the move was unlikely to produce a refinance wave, because most outstanding mortgages still carried rates well below the new market rate.</p>
      <h2>What it meant for clients</h2>
      <p>A cheaper MBS spread helps new purchase money more than it helps people who already locked a 3% or 4% loan. If you were buying, January was a better window than 2025. If you were hoping to refinance an existing loan, the math still had to clear closing costs — a headline dip was not enough.</p>
      <p class="article-sources"><strong>Sources:</strong> CNBC (Jan. 2026); Federal Reserve FOMC minutes (Jan. 28 meeting).</p>
    `,
  },
  {
    month: "February 2026",
    slug: "february-mortgage-rates-low",
    title: "Mortgage rates tagged a 2026 low — then started to climb.",
    kicker: "For Homeowners",
    date: "February 2026",
    summary: "The 30-year fixed briefly touched the high-5s to low-6s in February before inflation and geopolitics pushed rates back up.",
    description: "February 2026 mortgage rates hit a yearly low near 6%, then reversed as inflation and geopolitical risk returned.",
    lede: "February was the cheapest money of the year for many buyers. The 30-year fixed dipped as low as about 5.98%–6.09%, then the window started to close.",
    ctaLabel: "Get Started",
    ctaHref: "../get-started.html",
    body: `
      <p>After the late-2025 Fed cuts and the January MBS announcement, 30-year fixed rates drifted to their 2026 low in February. <a href="https://www.forbes.com/advisor/mortgages/mortgage-interest-rates-forecast/" target="_blank" rel="noopener">Forbes Advisor</a> later put that low at 5.98%. Bankrate recorded a February dip to about 6.09% before rates moved back above 6.25% in March.</p>
      <p>That low did not last. By spring, energy prices and the Middle East conflict were pushing inflation expectations — and mortgage spreads — the other way. Wells Fargo later argued that rates likely bottomed in the first quarter near 6.18% and would drift slightly higher from there.</p>
      <h2>The lesson</h2>
      <p>Rate windows close faster than people expect. Buyers who were “waiting for 5.5%” missed a perfectly usable 6% print. If a payment works at today’s rate and the house is the right house, locking is usually better than forecasting the next headline.</p>
      <p class="article-sources"><strong>Sources:</strong> Forbes Advisor mortgage forecast; Bankrate (June 18, 2026 recap); Wells Fargo housing outlook as cited in U.S. News.</p>
    `,
  },
  {
    month: "February 2026",
    slug: "february-fomc-minutes-refi",
    title: "Fed minutes: cheaper MBS, but no refinance boom.",
    kicker: "Rates & Economy",
    date: "February 18, 2026",
    summary: "January FOMC minutes, released in February, said MBS yields fell after the Fannie/Freddie news — but most borrowers still could not refinance.",
    description: "February 2026 FOMC minutes explained why lower MBS yields did not create a refinance wave.",
    lede: "When the January minutes came out in February, the Fed’s markets desk put numbers on what borrowers were already feeling: spreads improved, but the refinance incentive was still not there for most households.",
    ctaLabel: "Review your options",
    ctaHref: "../contact.html",
    body: `
      <p>The <a href="https://www.federalreserve.gov/monetarypolicy/fomcminutes20260128.htm" target="_blank" rel="noopener">minutes of the January 28 meeting</a>, released February 18, said the Fannie Mae and Freddie Mac portfolio announcement drew substantial market attention and was followed by a notable decline in MBS yields versus Treasuries.</p>
      <p>The same paragraph is the one that mattered for households: the decline was “unlikely to result in a material increase in mortgage refinancing” because current mortgage rates were still well above the weighted average rate on loans already outstanding. Corporate bond, leveraged-loan, and CMBS yields also eased over the period, as did 30-year conforming mortgage rates and new auto-loan rates.</p>
      <p>Household mortgage delinquencies remained near historic lows. Credit-card and auto delinquencies were still running above pre-pandemic levels — a reminder that “housing is fine” and “consumers are fine” are not the same sentence.</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve FOMC minutes, January 28, 2026 (released Feb. 18, 2026).</p>
    `,
  },
  {
    month: "March 2026",
    slug: "march-sba-7a-underwriting",
    title: "SBA ended SBSS scoring for 7(a) small loans.",
    kicker: "For Business Owners",
    date: "March 1, 2026",
    summary: "New 7(a) small-loan underwriting rules became mandatory March 1 after SBA sunset the FICO SBSS score in January.",
    description: "SBA’s March 1, 2026 change to 7(a) small-loan underwriting after ending SBSS scoring.",
    lede: "On March 1, SBA’s new underwriting rules for 7(a) small loans became mandatory. The FICO Small Business Scoring Service score that many lenders used as a shortcut was gone.",
    ctaLabel: "Ask about SBA financing",
    ctaHref: "../commercial-loans/sba-loans.html",
    body: `
      <p>SBA <a href="https://www.naggl.org/sba-notice-formally-announcing-sunsetting-of-sbss-scoring-and-providing-new-underwriting-requirements-for-7a-small-loans/" target="_blank" rel="noopener">Procedural Notice 5000-875701</a>, published January 16, formally sunset the FICO SBSS score for 7(a) Small Loans and rewrote the underwriting requirements in SOP 50 10 8. Those rules applied to all 7(a) Small Loans approved on or after March 1, 2026.</p>
      <p>In practice, that meant more file work and less “score and go.” Lenders had to underwrite the business the old-fashioned way: cash flow, time in business, use of proceeds, and documentation. For restaurant, construction, health-care, and other Main Street borrowers, a thin package that used to squeeze through on a score could stall.</p>
      <h2>What business owners should do</h2>
      <p>If you are considering SBA financing, bring complete tax returns, interim financials, and a clear use of proceeds. The program is still one of the better tools for owner-occupied real estate, equipment, and certain acquisitions. It is no longer a score-driven shortcut.</p>
      <p class="article-sources"><strong>Sources:</strong> SBA Procedural Notice 5000-875701; NAGGL (Jan. 17, 2026).</p>
    `,
  },
  {
    month: "March 2026",
    slug: "march-fed-one-cut-forecast",
    title: "March Fed: still on hold, still calling for one cut.",
    kicker: "Rates & Economy",
    date: "March 18, 2026",
    summary: "The March FOMC held at 3.50%–3.75% and kept a median forecast of one rate cut for 2026.",
    description: "The Federal Reserve’s March 2026 hold and Summary of Economic Projections calling for one cut.",
    lede: "The second Fed meeting of the year was another hold. The first 2026 Summary of Economic Projections still showed a median of one cut — even as inflation refused to settle at 2%.",
    ctaLabel: "Discuss rates and timing",
    ctaHref: "../get-started.html",
    body: `
      <p>At the March meeting, the Fed kept the funds rate at 3.50%–3.75%. <a href="https://finance.yahoo.com/news/live/fed-meeting-live-updates-federal-reserve-holds-rates-steady-forecasts-1-rate-cut-in-2026-180216872.html" target="_blank" rel="noopener">Yahoo Finance’s live coverage</a> noted that the first 2026 SEP maintained a median forecast for one cut during the year, matching the December projection.</p>
      <p>That forecast was a snapshot, not a promise. Mortgage rates had already begun to climb from the February low as inflation and geopolitical risk returned. A “one cut later” dots plot does not refinance a building or a house by itself.</p>
      <p>For commercial borrowers, March was the month to stop waiting for 2025-style cuts and start structuring the facility you actually need — term, line, SBA, or CRE — at a payment that works if the cut never arrives.</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve March 2026 FOMC; Yahoo Finance (March 19, 2026).</p>
    `,
  },
  {
    month: "April 2026",
    slug: "april-fed-powell-final-hold",
    title: "April’s Fed hold came with the most dissent since 1992.",
    kicker: "Rates & Economy",
    date: "April 29, 2026",
    summary: "In what was likely Chair Powell’s last meeting, the FOMC held rates again — with the highest level of dissent since 1992.",
    description: "April 29, 2026 FOMC hold at 3.50%–3.75% and an unusually divided Committee ahead of the Warsh transition.",
    lede: "The April 28–29 meeting held the funds rate at 3.50% to 3.75% again. The story was not the hold. It was how split the Committee had become.",
    ctaLabel: "Talk through your financing",
    ctaHref: "../get-started.html",
    body: `
      <p>On April 29 the Fed <a href="https://www.federalreserve.gov/newsevents/pressreleases/monetary20260429a.htm" target="_blank" rel="noopener">issued a standard hold</a>: activity expanding at a solid pace, the Committee attentive to both sides of the mandate, funds rate unchanged at 3-1/2 to 3-3/4 percent.</p>
      <p><a href="https://www.cnbc.com/2026/04/29/fed-interest-rate-decision-april-2026.html" target="_blank" rel="noopener">CNBC</a> described it as the highest level of dissent since 1992 and, potentially, Chair Jerome Powell’s final meeting before the leadership transition. Markets had fully priced a hold. What they could not price was how a more divided Fed would talk about the next hike — or cut — once a new chair took the gavel.</p>
      <p>For clients, April was another reminder that policy uncertainty itself is a cost. Lock when the payment works. Do not build a 2026 business plan that only works if the next chair cuts.</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve FOMC statement (April 29, 2026); CNBC (April 29, 2026).</p>
    `,
  },
  {
    month: "April 2026",
    slug: "april-fdic-cre-risk",
    title: "The FDIC put commercial real estate back on the risk list.",
    kicker: "Commercial Property",
    date: "April 22, 2026",
    summary: "The FDIC’s 2026 Risk Review flagged CRE, business lending, and funding risk after a difficult 2025 for banks.",
    description: "The FDIC 2026 Risk Review and what its CRE and business-lending findings mean for borrowers.",
    lede: "In April the FDIC published its 2026 Risk Review — a look back at the credit, funding, and interest-rate risks banks carried through 2025, with commercial real estate still near the top of the list.",
    ctaLabel: "Review a CRE or business loan",
    ctaHref: "../commercial-loans/index.html",
    body: `
      <p>The <a href="https://www.fdic.gov/analysis/2026-risk-review" target="_blank" rel="noopener">FDIC 2026 Risk Review</a> is not a consumer product. It is a supervisory map. It covered funding and interest-rate risk, then walked through credit in commercial real estate, nondepository lending, business loans, consumer credit, residential real estate, and agriculture.</p>
      <p>When examiners keep CRE on the front page, banks stay selective. That is why 2026 has been a year of “yes, but”: yes to strong multifamily, industrial, and sponsored office stories; slower on weak cash flow, short remaining term, or a refinance with no plan. It is also why private credit and CMBS took more of the deals banks did not want.</p>
      <h2>If you have a 2026 or 2027 maturity</h2>
      <p>Do not wait for the examiner’s mood to change. Start the refinance or recapitalization conversation while you still have time, rent rolls, and options. A clean package still clears. A last-minute one often does not.</p>
      <p class="article-sources"><strong>Sources:</strong> FDIC 2026 Risk Review (April 22, 2026).</p>
    `,
  },
  {
    month: "May 2026",
    slug: "may-cfpb-small-business-rule",
    title: "CFPB narrowed the small-business lending data rule.",
    kicker: "For Business Owners",
    date: "May 5, 2026",
    summary: "A revised Section 1071 rule raised the reporting threshold to 1,000 small-business loans a year and delayed reporting until 2028.",
    description: "How the CFPB’s May 2026 rewrite of the small-business lending rule changes compliance for lenders and credit access for owners.",
    lede: "On May 1 the CFPB published a scaled-back Section 1071 rule. Fewer lenders have to report small-business credit data, and the data they collect is narrower.",
    ctaLabel: "Talk about business credit",
    ctaHref: "../commercial-loans/index.html",
    body: `
      <p><a href="https://nationalmortgageprofessional.com/news/cfpb-scales-back-small-business-lending-rule-easing-burden-smaller-lenders" target="_blank" rel="noopener">National Mortgage Professional reported May 5</a> that the Bureau raised the coverage threshold to 1,000 small-business loans a year, up from 100. It trimmed required data, excluded merchant cash advances and some agricultural and small-dollar products, and lowered the “small business” revenue definition to about $1 million. Compliance is based on 2026–2027 activity, with reporting in 2028.</p>
      <p>The MBA supported the rewrite as more workable. The policy fight over the statute itself is not over. For a business owner, the near-term effect is practical: more community and independent lenders stay in the market because the compliance tax is lower.</p>
      <p>That is good for access to working capital and owner-occupied financing. It is not a loosening of credit standards. You still need a file that underwrites.</p>
      <p class="article-sources"><strong>Sources:</strong> National Mortgage Professional (May 5, 2026); CFPB Section 1071 / Regulation B final rule.</p>
    `,
  },
  {
    month: "May 2026",
    slug: "may-fhfa-house-prices",
    title: "House prices were still rising — just more slowly.",
    kicker: "For Homeowners",
    date: "May 26, 2026",
    summary: "FHFA said U.S. house prices rose 1.7% from the first quarter of 2025 to the first quarter of 2026.",
    description: "FHFA’s May 2026 house-price report and what slower appreciation means for owners and buyers.",
    lede: "Home values did not crack. They cooled. FHFA’s first-quarter House Price Index was up 1.7% year over year — a far cry from the double-digit run of the early 2020s.",
    ctaLabel: "Review homeowners coverage",
    ctaHref: "../intake/personal.html?product=homeowners-insurance",
    body: `
      <p>On May 26 the <a href="https://www.fhfa.gov/" target="_blank" rel="noopener">Federal Housing Finance Agency</a> reported that U.S. house prices rose 1.7% between the first quarter of 2025 and the first quarter of 2026, and 0.5% from the prior quarter. Later monthly prints showed a slight April dip and a 0.3% May rebound, with May still up 2.2% year over year.</p>
      <p>Slower appreciation is not a crash. It is a market where equity still exists but does not bail out a bad purchase. For buyers, it means you cannot assume the house will “grow into” an uncomfortable payment. For owners, it means insurance rebuild cost and market value are still diverging — replacement cost has been rising even where sale prices are only inching up.</p>
      <p>If you have not reviewed dwelling limits in two years, the May data is a reason to do it. A 2% price gain does not mean your rebuild cost went up 2%.</p>
      <p class="article-sources"><strong>Sources:</strong> FHFA House Price Index releases (May 26, June 30, and July 28, 2026).</p>
    `,
  },
  {
    month: "June 2026",
    slug: "june-warsh-first-vote",
    title: "Kevin Warsh’s first rate vote: another hold.",
    kicker: "Rates & Economy",
    date: "June 17, 2026",
    summary: "The June 16–17 FOMC was the first rate decision overseen by Chairman Kevin Warsh. The funds rate stayed at 3.50%–3.75%.",
    description: "The June 2026 FOMC — Kevin Warsh’s first rate vote — held the federal funds rate unchanged.",
    lede: "June 16–17 was billed as the start of a Fed “regime change.” The first vote under Chairman Kevin Warsh was still a hold.",
    ctaLabel: "Discuss your rate exposure",
    ctaHref: "../get-started.html",
    body: `
      <p><a href="https://www.realtor.com/news/trends/kevin-warsh-fed-meeting-interest-rate-decision-june-2026/" target="_blank" rel="noopener">Realtor.com</a> framed the June meeting as Warsh’s first as the new chairman. He had called for “regime change” at the central bank. The <a href="https://www.federalreserve.gov/monetarypolicy/fomcminutes20260617.htm" target="_blank" rel="noopener">June minutes</a> show the Committee still directed the Desk to keep the funds rate in a 3-1/2 to 3-3/4 percent range, with interest on reserves at 3.65% and the primary credit rate at 3.75%.</p>
      <p>HousingWire’s recap of the same period noted this was the fourth straight pause, with May CPI at 4.2% and payrolls still adding jobs. Nine officials saw a hike by year-end in the June projections, and the median funds-rate dot moved up to 3.8%.</p>
      <p>New chair, same message for borrowers: do not finance a long-term asset on a short-term hope. Structure the loan so the payment works if the next move is a hike, not a cut.</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve June 16–17, 2026 minutes; Realtor.com (June 16, 2026); HousingWire (June 17, 2026).</p>
    `,
  },
  {
    month: "June 2026",
    slug: "june-inflation-mortgage-outlook",
    title: "Inflation and the Iran conflict pushed mortgage rates back up.",
    kicker: "For Homeowners",
    date: "June 17, 2026",
    summary: "May CPI at 4.2% and energy prices tied to the Middle East conflict kept 30-year rates in the mid-6s after the February low.",
    description: "How June 2026 inflation data and geopolitical energy prices affected mortgage and commercial borrowing costs.",
    lede: "By mid-June the February rate low was a memory. Inflation was running more than double the Fed’s target, energy prices were in the story, and mortgage rates had moved back into the mid-6% range.",
    ctaLabel: "Get Started",
    ctaHref: "../get-started.html",
    body: `
      <p><a href="https://www.housingwire.com/articles/fed-holds-rates-inflation-mortgage/" target="_blank" rel="noopener">HousingWire reported</a> that the Fed held at 3.5%–3.75% as CPI ran at 4.2% and May payrolls rose by 172,000. Analysts said mortgage rates would keep tracking inflation expectations and Treasury yields more than the policy rate itself.</p>
      <p>NerdWallet later summarized the path: rates climbed sharply from early March as the Iran conflict lifted oil-price fears, dipped briefly in April, then stayed elevated. MBA economists have been explicit that the war, oil disruption, and inflation are why they see 30-year rates averaging about 6.5% through 2026–2028.</p>
      <p>Homeowners should separate two questions. Can I buy or refinance at a payment I can carry today? And do I want to bet the next six months of rent or house-hunting on a cease-fire and a cooler CPI print? Only the first question is in your control.</p>
      <p class="article-sources"><strong>Sources:</strong> HousingWire (June 17, 2026); NerdWallet (July 29, 2026); MBA mortgage finance forecasts as cited by U.S. News.</p>
    `,
  },
  {
    month: "July 2026",
    slug: "july-warsh-congress-inflation",
    title: "Warsh told Congress the Fed has “no tolerance” for high inflation.",
    kicker: "Rates & Economy",
    date: "July 14, 2026",
    summary: "In his first Humphrey-Hawkins testimony, Chairman Warsh struck a hawkish tone even as June CPI cooled to 3.5%.",
    description: "Chairman Kevin Warsh’s July 14, 2026 testimony to Congress and what a hawkish Fed means for borrowers.",
    lede: "On July 14 Chairman Warsh delivered the semiannual Monetary Policy Report to Congress. The same morning, June CPI showed inflation cooling. His message was still hard-edged: no tolerance for high inflation.",
    ctaLabel: "Review your debt and coverage",
    ctaHref: "../contact.html",
    body: `
      <p>Warsh’s <a href="https://www.federalreserve.gov/newsevents/testimony/warsh20260714a.htm" target="_blank" rel="noopener">prepared testimony</a> went to the House Financial Services Committee on July 14 and the Senate Banking Committee on July 15. Coverage of the hearing noted he spoke shortly after the government reported that prices fell 0.4% from May to June, mostly on cheaper gasoline. Year-over-year inflation dropped to 3.5% from 4.2%; core rose 2.6%.</p>
      <p>A cooler monthly print and a hawkish chair can coexist. The Committee had already spent the first half of the year on hold. Three members would dissent in favor of a hike two weeks later. For a borrower, the takeaway from mid-July was not “inflation is solved.” It was “this Fed will not rush to ease just because gas prices dropped for a month.”</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve testimony (July 14, 2026); contemporaneous hearing coverage of the June CPI report.</p>
    `,
  },
  {
    month: "July 2026",
    slug: "fed-holds-rates",
    title: "July 29: the Fed holds again, with three votes for a hike.",
    kicker: "Rates & Economy",
    date: "July 29, 2026",
    summary: "Nine members held at 3.50%–3.75%. Three preferred a quarter-point increase. Markets began pricing hikes, not cuts.",
    existing: true,
  },
  {
    month: "August 2026",
    slug: "homeowners-insurance-costs",
    title: "Home insurance costs are still climbing — and coverage is harder to keep.",
    kicker: "For Homeowners",
    date: "August 6, 2026",
    summary: "NAIC-based reporting showed multi-year premium jumps well above inflation, with more non-renewals in weather-exposed markets.",
    existing: true,
  },
  {
    month: "August 2026",
    slug: "commercial-lending-rebounds",
    title: "Commercial and multifamily lending rose 16% in the second quarter.",
    kicker: "For Business Owners",
    date: "August 6, 2026",
    summary: "MBA originations data pointed to a thaw in CRE finance, including a rebound in office lending and stronger CMBS volume.",
    existing: true,
  },
];

function archiveByMonthHtml() {
  const months = [];
  for (const post of archivePosts) {
    if (!months.includes(post.month)) months.push(post.month);
  }
  return months
    .map((month) => {
      const items = archivePosts.filter((post) => post.month === month);
      return `
        <div class="archive-month">
          <h3>${esc(month)}</h3>
          <div class="archive-list">
            ${items
              .map(
                (post) => `
              <article class="archive-item">
                <div>
                  <p class="card-tag">${esc(post.kicker)} · ${esc(post.date)}</p>
                  <h4><a href="${post.slug}.html">${esc(post.title)}</a></h4>
                  <p>${esc(post.summary)}</p>
                </div>
                <a class="btn btn-outline" href="${post.slug}.html">Read</a>
              </article>`
              )
              .join("")}
          </div>
        </div>`;
    })
    .join("");
}

pages.push({
  file: "blog/index.html",
  html: layout({
    title: "Blog | Wellesley Collective",
    description: "Guides and briefings from Wellesley Collective on insurance, annuities, commercial financing, rates, and commercial real estate.",
    root: "../",
    path: "blog/index.html",
    current: "blog",
    extraScripts: ["js/blog.js?v=5"],
    content: `
    <section class="page-hero">
      <div class="page-hero-media">${photo({ src: "assets/images/hero-city.jpg", alt: "City skyline at dusk", root: "../", lazy: false })}</div>
      <div class="container page-hero-content">
        <p class="eyebrow">Wellesley Insights</p>
        <h1>News that affects your coverage and capital.</h1>
        <p class="lede">Guides for insurance, annuities, and commercial financing — plus the headlines that move premiums, payments, and deal terms.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Guides</p>
          <h2>Evergreen reading for coverage, income, and capital.</h2>
          <p>Named products, written so you can act — then a conversation if you want Wellesley Collective to review the file.</p>
        </div>
        <div class="grid-3">
          ${guides
            .map(
              (g) => `
            <article class="product-card">
              <p class="card-tag">Guide</p>
              <h3>${esc(g.title)}</h3>
              <p>${esc(g.summary)}</p>
              <a class="btn btn-outline" href="${g.slug}.html">Read guide</a>
            </article>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="section-tight section-cream">
      <div class="container">
        <div class="live-head">
          <div>
            <p class="kicker"><span class="live-dot" aria-hidden="true"></span> Live</p>
            <h2>Today’s market headlines</h2>
            <p class="subhead">From the Fed, CNBC, HousingWire, and Insurance Journal.</p>
          </div>
          <div class="live-actions">
            <p class="form-note" id="news-updated">Checking feeds…</p>
            <button class="btn btn-outline" type="button" id="news-refresh">Refresh</button>
          </div>
        </div>
        <div class="blog-filters" role="tablist" aria-label="Filter headlines">
          <button class="filter-btn is-active" type="button" data-filter="all">All</button>
          <button class="filter-btn" type="button" data-filter="homeowners">For Homeowners</button>
          <button class="filter-btn" type="button" data-filter="business">For Business Owners</button>
          <button class="filter-btn" type="button" data-filter="insurance">Insurance</button>
          <button class="filter-btn" type="button" data-filter="financial">Financial Services</button>
          <button class="filter-btn" type="button" data-filter="rates">Rates &amp; Economy</button>
          <button class="filter-btn" type="button" data-filter="cre">Commercial Property</button>
        </div>
        <div id="news-grid" class="news-grid" aria-live="polite"></div>
        <p class="disclaimer mt-24">Headlines open on the original publisher. This is news, not a quote or a commitment to lend.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <p class="kicker">Wellesley briefings</p>
          <h2>What the news means for our clients.</h2>
          <p>What this week’s numbers mean for premiums, payments, and credit.</p>
        </div>
        <div class="grid-2">
          <article class="card">
            <div class="card-body">
              <p class="card-tag">Rates &amp; Economy · August 17, 2026</p>
              <h3>The Fed is holding. Borrowing costs are not standing still.</h3>
              <p>July CPI eased to 3.4% and traders pulled back on a September hike. Mortgage and commercial loan pricing still follow Treasuries more than the policy rate.</p>
              <a class="btn btn-navy" href="fed-holds-rates.html">Read briefing</a>
            </div>
          </article>
          <article class="card">
            <div class="card-body">
              <p class="card-tag">For Homeowners · August 17, 2026</p>
              <h3>Home insurance costs are still climbing — and coverage is harder to keep.</h3>
              <p>NAIC-based reporting shows multi-year premium jumps well above inflation, with more non-renewals in weather-exposed markets.</p>
              <a class="btn btn-navy" href="homeowners-insurance-costs.html">Read briefing</a>
            </div>
          </article>
          <article class="card">
            <div class="card-body">
              <p class="card-tag">For Business Owners · August 17, 2026</p>
              <h3>Commercial and multifamily lending rose 16% in the second quarter.</h3>
              <p>MBA originations data points to a thaw in CRE finance, including a notable rebound in office lending and stronger CMBS volume.</p>
              <a class="btn btn-navy" href="commercial-lending-rebounds.html">Read briefing</a>
            </div>
          </article>
          <article class="card">
            <div class="card-body">
              <p class="card-tag">Insurance · August 17, 2026</p>
              <h3>Flood is still not in a standard homeowners policy.</h3>
              <p>FEMA continues to remind buyers and owners that flood is a separate policy — and many homes outside mapped high-risk zones still flood.</p>
              <a class="btn btn-navy" href="flood-coverage-reminder.html">Read briefing</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-cream" id="archive">
      <div class="container">
        <div class="section-head">
          <p class="kicker">2026 archive</p>
          <h2>January through August.</h2>
          <p>The developments that moved rates, premiums, housing, and business credit this year.</p>
        </div>
        ${archiveByMonthHtml()}
      </div>
    </section>`,
  }),
});

pages.push({
  file: "blog/fed-holds-rates.html",
  html: insightPage({
    slug: "fed-holds-rates",
    title: "The Fed is holding. Borrowing costs are not standing still.",
    description: "What the Fed’s hold at 3.50–3.75% and July’s 3.4% CPI reading mean for homeowners and business borrowers.",
    kicker: "Rates & Economy",
    date: "August 17, 2026",
    lede: "The Federal Reserve has kept the federal funds rate at 3.50% to 3.75%. July consumer prices rose 3.4% from a year earlier, and markets pulled back on the chance of a September hike. That is useful news. It is not the same thing as cheaper money.",
    ctaLabel: "Discuss financing",
    ctaHref: "../get-started.html",
    body: `
      <p>At its July 29 meeting, the Federal Open Market Committee left the policy rate unchanged, a pause investors largely expected. <a href="https://www.usbank.com/investing/financial-perspectives/market-news/federal-reserve-tapering-asset-purchases.html" target="_blank" rel="noopener">U.S. Bank’s recap</a> noted that core PCE inflation was still running at 3.3% in June — well above the Fed’s 2% target — even as the labor market stayed firm.</p>
      <p>The newer data point is July CPI. <a href="https://www.reuters.com/business/traders-stick-narrow-bets-september-fed-hold-after-inflation-data-2026-08-12/" target="_blank" rel="noopener">Reuters reported on August 12</a> that the Consumer Price Index rose 3.4% year over year, down from 3.5% in June, while core CPI slowed to 2.5%. Traders added to bets that the Fed will hold again in September. A softer print also eased rate-hike anxiety in global markets later that week.</p>
      <p>Households are not celebrating just yet. The New York Fed’s July Survey of Consumer Expectations, released August 7, showed one-year inflation expectations only a tenth lower at 3.6%, with expected home-price growth still at 3.2%.</p>
      <h2>What this means for homeowners</h2>
      <p>Mortgage rates do not move lockstep with the federal funds rate. They track longer-term Treasury yields and inflation expectations. HousingWire made the same point after earlier 2026 pauses: the mortgage outlook depends more on inflation and the 10-year yield than on whether the Fed hikes 25 basis points next month.</p>
      <p>If you are planning a purchase or a refinance later this year, treat the current range as a planning band, not a promise of lower payments. A pre-approval conversation is still the cleanest way to know what payment you can actually carry.</p>
      <h2>What this means for business owners</h2>
      <p>Working capital, equipment, and commercial real estate pricing will stay sensitive to credit spreads and the shape of the yield curve. A hold is better than a surprise hike. It does not automatically reopen cheap, long-duration credit.</p>
      <p>If cash flow is lumpy, a line of credit or short-term facility is usually a better match than stretching for a long-term loan on the hope that rates fall. If you are refinancing a commercial property, start the conversation before a 2026 or 2027 maturity is on top of you — CRE refinancing calendars remain heavy.</p>
      <p class="article-sources"><strong>Sources:</strong> Federal Reserve FOMC; Reuters (Aug. 12, 2026); U.S. Bank (July 31, 2026); New York Fed Survey of Consumer Expectations (Aug. 7, 2026); HousingWire.</p>
    `,
  }),
});

pages.push({
  file: "blog/homeowners-insurance-costs.html",
  html: insightPage({
    slug: "homeowners-insurance-costs",
    title: "Home insurance costs are still climbing — and coverage is harder to keep.",
    description: "What rising homeowners insurance premiums and non-renewals mean for owners, buyers, and landlords.",
    kicker: "For Homeowners",
    date: "August 17, 2026",
    lede: "Premiums have outpaced inflation for years, and a new industry report says keeping a policy is getting harder — not just more expensive. That matters for anyone who owns a home, a rental, or a condo.",
    ctaLabel: "Get Started",
    ctaHref: "../intake/personal.html?product=homeowners-insurance",
    body: `
      <p>On August 6, <a href="https://www.cnbc.com/2026/08/06/homeowners-insurance-costs-soar-naic-report.html" target="_blank" rel="noopener">CNBC reported</a> on National Association of Insurance Commissioners findings: homeowners insurance premiums have risen faster than inflation nationwide, and insurers are dropping customers at a higher rate. After adjusting for inflation, consumers saw average premium increases of 18% in the Northeast, 25% in the Midwest, 27% in the Southeast, and 43% in the West over a seven-year window.</p>
      <p>That tracks a longer Treasury finding: from 2018 to 2022, average premiums per policy rose 8.7% faster than inflation, with the highest-risk ZIP codes paying far more than the lowest-risk ones. The Zebra’s 2026 home-trend work put the average homeowner near $2,966 a year — and found that nearly half of owners said they would struggle to pay the mortgage if premiums rose again.</p>
      <p>Costs also vary wildly by state. A MoneyGeek analysis published August 4 put a national average well above $3,000 in one standardized profile, while a handful of states remain a fraction of that. Location, construction, roof age, and weather exposure still drive the quote more than any national headline.</p>
      <h2>What to do before your renewal</h2>
      <ul>
        <li>Review dwelling limits against today’s rebuild cost, not the purchase price.</li>
        <li>Ask whether the roof, water backup, ordinance-or-law, and wind/hail deductibles still match the house you own.</li>
        <li>If you were non-renewed, do not wait. Replacement markets move faster when you still have days on the current policy.</li>
        <li>Remember that flood is almost never in the homeowners form. If surface water or a nearby waterway is a real risk, price a flood policy separately.</li>
      </ul>
      <p>Landlords and condo owners should not assume the association or the tenant has them covered. A landlord or HO-6 policy still has to meet the gap the master policy leaves behind.</p>
      <p class="article-sources"><strong>Sources:</strong> CNBC / NAIC (Aug. 6, 2026); U.S. Department of the Treasury; The Zebra 2026 State of Insurance; MoneyGeek / Quartz (Aug. 4, 2026).</p>
    `,
  }),
});

pages.push({
  file: "blog/commercial-lending-rebounds.html",
  html: insightPage({
    slug: "commercial-lending-rebounds",
    title: "Commercial and multifamily lending rose 16% in the second quarter.",
    description: "MBA data shows commercial and multifamily originations up 16% year over year in Q2 2026, including a rebound in office financing.",
    kicker: "For Business Owners",
    date: "August 17, 2026",
    lede: "Credit is not wide open, but it is moving again. The Mortgage Bankers Association says commercial and multifamily originations were 16% higher in the second quarter than a year earlier — and 12% higher than the first quarter.",
    ctaLabel: "Apply Now",
    ctaHref: "../get-started.html",
    body: `
      <p>On August 6, the <a href="https://www.mba.org/news-and-research/newsroom/news/2026/08/06/commercial-multifamily-borrowing-increased-16-percent-in-the-second-quarter-of-2026" target="_blank" rel="noopener">Mortgage Bankers Association</a> reported that commercial and multifamily mortgage originations rose 16% year over year in the second quarter of 2026. MBA’s Reggie Booker pointed to improving capital markets and stronger transaction activity. Office lending rose on both an annual and quarterly basis — a notable change for a sector that has spent years under pressure.</p>
      <p>The mix matters. Year over year, loan volume was up 61% for retail, 47% for office, 19% for hotels, 8% for multifamily, and 6% for industrial. Health care originations fell 19%. On the capital-source side, CMBS volume jumped 68% and bank/depository loans rose 61%, while GSE and life-company originations declined.</p>
      <p>That thaw sits next to a still-heavy maturity wall. Legal and market commentary earlier this year put hundreds of billions of CRE loans on the 2026 calendar, with office CMBS delinquency still elevated compared with the last cycle. Private credit has filled some of the gap where traditional lenders pulled back.</p>
      <h2>What this means if you own or operate a property</h2>
      <p>If you have been waiting for “the market to reopen,” Q2 is evidence that more capital is clearing — especially for retail, industrial, multifamily, and selected office stories with a real business plan. It is not evidence that every deal will clear at 2021 terms.</p>
      <p>Bring a clean package: rent roll or operating statements, a defined use of proceeds, and a refinance or hold thesis. Bridge and construction conversations still need a take-out path. Owner-users should also look at SBA options when the building is occupied by the operating company.</p>
      <h2>What this means for operating businesses</h2>
      <p>Working capital and equipment financing remain a separate conversation from long-term CRE debt. If receivables or inventory are growing faster than cash, an asset-based facility or line of credit is usually the right first call — not a property refinance you do not need.</p>
      <p class="article-sources"><strong>Sources:</strong> Mortgage Bankers Association Quarterly Survey of Commercial/Multifamily Mortgage Bankers Originations (Aug. 6, 2026); industry CRE maturity and CMBS commentary, 2026.</p>
    `,
  }),
});

pages.push({
  file: "blog/flood-coverage-reminder.html",
  html: insightPage({
    slug: "flood-coverage-reminder",
    title: "Flood is still not in a standard homeowners policy.",
    description: "FEMA’s standing guidance: flood damage is excluded from most homeowners policies. What owners and buyers should do about it.",
    kicker: "Insurance",
    date: "August 17, 2026",
    lede: "Every hurricane season and spring melt, the same surprise shows up: the homeowners policy does not pay for flood. FEMA’s guidance has not changed. The risk has not gone away either.",
    ctaLabel: "Get Started",
    ctaHref: "../intake/personal.html?product=flood-insurance",
    body: `
      <p><a href="https://www.fema.gov/flood-insurance" target="_blank" rel="noopener">FEMA is direct about it</a>: most homeowners insurance does not cover flood damage. Flood insurance is a separate policy for the building, the contents, or both. It is available in participating National Flood Insurance Program communities, and it is required for many homes in high-risk zones that carry a government-backed mortgage.</p>
      <p>That requirement is the floor, not the full picture. Floods happen outside mapped high-risk zones. Updated flood maps and heavier rainfall have pulled more properties into a conversation they did not have five years ago. Industry notes heading into 2026 also flagged that many flood premiums are running 10% or more above the prior year, especially for homes newly added to flood zones.</p>
      <p>Commercial buildings have the same gap. A commercial property form typically excludes flood unless you add dedicated coverage. If the building sits near a waterway, in a coastal market, or in an area with drainage problems, that exclusion is worth pricing — not discovering after a claim.</p>
      <h2>A short checklist</h2>
      <ul>
        <li>Pull the flood zone and elevation information for the address, even if you have never been required to buy a policy.</li>
        <li>Decide whether you need building coverage, contents coverage, or both.</li>
        <li>If you are buying, do not wait for the lender to tell you. Waiting can delay closing or leave a gap at possession.</li>
        <li>Coordinate flood with the homeowners or commercial property policy so deductibles and limits are not working against each other.</li>
      </ul>
      <p class="article-sources"><strong>Sources:</strong> FEMA Flood Insurance; NFIP consumer guidance; 2026 industry flood-premium commentary.</p>
    `,
  }),
});

for (const post of guides) {
  pages.push({
    file: `blog/${post.slug}.html`,
    html: insightPage({
      slug: post.slug,
      title: post.title,
      description: post.description,
      kicker: post.kicker,
      date: post.date,
      lede: post.lede,
      body: post.body,
      ctaLabel: post.ctaLabel,
      ctaHref: post.ctaHref,
    }),
  });
}

for (const post of archivePosts) {
  if (post.existing) continue;
  pages.push({
    file: `blog/${post.slug}.html`,
    html: insightPage({
      slug: post.slug,
      title: post.title,
      description: post.description,
      kicker: post.kicker,
      date: post.date,
      lede: post.lede,
      body: post.body,
      ctaLabel: post.ctaLabel,
      ctaHref: post.ctaHref,
    }),
  });
}

for (const item of personalLines) {
  pages.push({
    file: `insurance/${item.slug}.html`,
    html: productPage({
      item,
      folder: "insurance",
      current: "insurance",
      eyebrow: "Personal Lines",
      cta: "Get Started",
      siblingLabel: "Insurance",
      siblings: personalLines,
      relatedExtra: commercialLines,
      image: "hero-home.jpg",
      need: "insurance",
      intakeHref: "../intake/personal.html",
      guides: guidesFor(...(PRODUCT_GUIDES[item.slug] || [])),
    }),
  });
}

for (const item of commercialLines) {
  pages.push({
    file: `insurance/${item.slug}.html`,
    html: productPage({
      item,
      folder: "insurance",
      current: "insurance",
      eyebrow: "Commercial Lines",
      cta: "Get Started",
      siblingLabel: "Insurance",
      siblings: commercialLines,
      relatedExtra: personalLines,
      image: "hero-commercial.jpg",
      need: "insurance",
      intakeHref: "../intake/commercial.html",
      guides: guidesFor(...(PRODUCT_GUIDES[item.slug] || [])),
    }),
  });
}

const lifeEyebrow = {
  life: "Life Insurance",
  annuity: "Annuities",
  disability: "Disability",
  ltc: "Long-Term Care",
};

for (const item of lifeProducts) {
  const isBusiness = item.slug === "business-life-insurance";
  pages.push({
    file: `insurance/${item.slug}.html`,
    html: productPage({
      item,
      folder: "insurance",
      current: "insurance",
      eyebrow: lifeEyebrow[item.kind] || "Life Insurance",
      cta: "Get Started",
      siblingLabel: "Insurance",
      siblings: lifeProducts,
      relatedExtra: isBusiness ? commercialLines : personalLines,
      image: item.image || "hero-home.jpg",
      need: "life",
      quoteHref: isSelfQuote(item) ? "quote.html" : "",
      guides: guidesFor(...(PRODUCT_GUIDES[item.slug] || [])),
    }),
  });
}

for (const item of annuityLines) {
  pages.push({
    file: `financial-services/${item.slug}.html`,
    html: productPage({
      item,
      folder: "financial-services",
      current: "financial",
      eyebrow: "Annuities",
      cta: "Get Started",
      siblingLabel: "Financial Services",
      siblings: annuityLines,
      relatedExtra: lifeProducts.map((other) => ({ ...other, folder: "insurance" })),
      image: item.image || "hero-city.jpg",
      need: "annuities",
      guides: guidesFor(...(PRODUCT_GUIDES[item.slug] || [])),
    }),
  });
  pages.push({
    file: `insurance/${item.slug}.html`,
    redirect: true,
    html: redirectPage(`../financial-services/${item.slug}.html`),
  });
}

for (const item of loanProducts) {
  pages.push({
    file: `commercial-loans/${item.slug}.html`,
    html: productPage({
      item,
      folder: "commercial-loans",
      current: "loans",
      eyebrow: "Commercial Financing",
      cta: "Apply Now",
      siblingLabel: "Commercial Financing",
      siblings: loanProducts,
      image: "hero-city.jpg",
      need: "financing",
      guides: guidesFor(...(PRODUCT_GUIDES[item.slug] || [])),
    }),
  });
}

for (const page of pages) {
  const dest = path.join(rootDir, page.file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, page.html);
  console.log("wrote", page.file);
}

console.log(`Generated ${pages.length} pages.`);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((page) => page.file.endsWith(".html") && !page.redirect && page.file !== "quote.html" && page.file !== "residential-mortgages.html")
  .map((page) => `  <url><loc>${SITE}/${page.file}</loc></url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(rootDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`
);
console.log("wrote sitemap.xml and robots.txt");
