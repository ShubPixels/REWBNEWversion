import threeAscarpbaling from "../images/3 Action Scrap Baling Press.png";
import twoAscrapbaling from "../images/2 action.png";
import petbottlingpress from "../images/PHOTO EDIT 22.png";
import Contpaperbaler from "../images/Manual Paper Baler Machine.jpg";
import Contbaler from "../images/Automatic  Continuous Baling Machine.jpg";
import Conscraper from "../images/bluemach.webp";
import shredder from "../images/Shredder Machine.jpg";
import jumboscrapbaling from "../images/Jumbo Scrap Baling Machine.jpg";
import bidbreaking from "../images/Bid Breaking Machine.jpg";
import carbalingmachine from "../images/Car Baling Machine.jpg";
import scrapshreaing from "../images/Scrap Shearing Machine (kechi).jpg";
import ringrolling from "../images/Ring Rolling Machine.jpg";
import coldshearing from "../images/Cold Shearing Machine.jpg";
import heavylathe from "../images/Heavy Duty Lathe Machine.jpg";
import numberpunch from "../images/Number Punching Machine.jpg";
import sheetslit from "../images/Sheet Slitting Machine.jpg";
import dipipe from "../images/DI - Pipe Breaking Machine.jpg";
import pipehydro from "../images/Pipe Hydrotest Machine.jpg";
import gauginsizing from "../images/Pipe Sizing and Guaging Machine.jpg";
import hydraulic_cus from "../images/Hydraulic Press (customized).jpg";
import sheetbending from "../images/Sheet Bending Machine.jpg";
import manualpaperbaler from "../images/Manual Paper Baler Machine.jpg";

const productsData = {
    //Waste Management
    "triple-action-scrap-baling-press": {
      videoUrl: "https://www.youtube.com/watch?v=i6Kmm21FPZs&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=35",
      category: "Waste Management",
      name: "Triple Action Scrap Baling Press",
      tagline:"The Ultimate Solution for Metal Scrap Management",
      heading:"industry",
      benifits:[
        "Higher Scrap Selling Price",
        "Efficient Recycling",
        "Lower Transportation Costs",
        "Minimal Space Usage",
        "Ease of Material Handling"
       ],
      description: "The Triple Action Scrap Baling Press is a powerhouse in the scrap processing industry, designed to achieve the highest output with the lowest power consumption. Available from bale sizes from 8” up to 18” and beyond, the standard weight of bale starts from 10 kg up to 800 kg for custom built up units. This machine stands as a testament to our commitment to quality and efficiency. With over hundreds of units being shipped every year, our baling press is trusted by businesses worldwide for its robust performance and durability.",
      image: [threeAscarpbaling ],
      specifications:[
        { "Size": "8\" x 8\"", "Bale Weight": "25 Kg", "Idle Cycle Time": "45 Sec", },
        { "Size": "10\" x 10\"", "Bale Weight": "35 Kg", "Idle Cycle Time": "50 Sec"},
        { "Size": "12\" x 12\"", "Bale Weight": "50 Kg", "Idle Cycle Time": "60 Sec" },
        { "Size": "14\" x 14\"", "Bale Weight": "70 Kg", "Idle Cycle Time": "60 Sec" },
        { "Size": "16\" x 16\"", "Bale Weight": "125 Kg", "Idle Cycle Time": "80 Sec" }
      ],
      applications: {
      materials: [
        "Mild Steel",
        "Stainless Steel",
        "Aluminum",
        "Copper",
        "Commercial Scrap",
        "Plastic / Paper"
      ]
    }
    },
    "double-action-scrap-baling-press": {
      videoUrl: "https://www.youtube.com/watch?v=wNAA8Wb5JNg&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=64",
      category: "Waste Management",
      name: "Double Action Scrap Baling Press",
      tagline:"Dual Compression Power for High Scrap Efficiency",
      heading:"purpose",
      benifits:[
        "Higher Scrap Selling Price",
        "Efficient Recycling",
        "Lower Transportation Costs",
        "Minimal Space Usage",
        "Ease of Material Handling"
      ],
      description: "The 2 Action Baling Press is a compact and efficient solution, perfect for small-scale operations. Designed for smaller capacity and production needs, this press is ideal for businesses requiring a straightforward, non-automated baling process. It starts from bale size of 8” up to 16” with bale weight starting from 8 Kg.",
      image: [twoAscrapbaling],
      specifications: [
        { "Size": "10\" x 10\"", "Bale Weight": "Up to 15 Kg", "Idle Cycle Time": "55 Sec"},
        { "Size": "15\" x 15\"", "Bale Weight": "Up to 45 Kg", "Idle Cycle Time": "60 Sec" },
        { "Size": "20\" x 20\"", "Bale Weight": "Up to 90 Kg", "Idle Cycle Time": "80 Sec"}
      ],
      applications: {
       materials: [
        "Mild Steel",
        "Stainless Steel",
        "Aluminum",
        "Copper",
        "Commercial Scrap",
        "Plastic / Paper"
       ]
      }
    },
    "pet-bottle-baling-press": {
      videoUrl: "https://www.youtube.com/watch?v=oB2KDrQjP8E&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=19",
      category: "Waste Management",
      name: "PET Bottle Baling Press",
      tagline:"Transform Bottle Waste into Compact, Recyclable Assets",
      description: "The PET Bottle Press Machine is a cost-effective, one-action solution tailored for handling low-strength materials such as plastic bottles, clothes, and large hollow metal objects. Ideal for smaller operations, this press offers a low-cost way to efficiently process and compact materials. The standard sizes starts from 12” up to 24” with lowest bale weight from 30 Kg.",
      image: [petbottlingpress],
      benifits:[
        "Boost Recycling ROI",
        "Compliance with Environmental Standards",
        "Efficient Recycling",
        "Lower Transportation Costs",
        "Minimal Space Usage",
        "Ease of Material Handling"
      ],
      specifications: [
        { "Bale Size": "26\" x 36\"", "Bale Weight": "150 Kg" },
        { "Bale Size": "36\" x 40\"", "Bale Weight": "Up to 400 Kg" }
      ],
      applications: {
        materials: [
          "PET Plastic Bottles (all sizes)",
          "HDPE Containers (optional customization)",
          "Lightweight Plastic Packaging",
          "Cotton and Cloth Wastes"
        ]
      }
    },
    // "continuous-paper-baling-machine": {
    //   category: "Waste Management",
    //   name: "Continuous Paper Baling Machine",
    //   tagline:"Uninterrupted Efficiency for Paper Recycling",
    //   description: "The Continuous Paper Baler Machine is equipped with an automatic paper tying system, often complemented by a conveyor system for effortless material handling. This machine is designed to streamline the baling process for paper and cardboard waste, making it an excellent choice for high-volume paper recycling operations. On the starting capacity, It processes 30 bales a day on the with bale weight 100 Kg.",
    //   image: [Contpaperbaler],
    //   benifits:[
    //     "Maximize Throughput without operators",
    //     "Reduce Waste Volume by 85%",
    //     "Sustainability Compliance",
    //     "Scalable Solutions"
    //   ],
    //   specifications: [
        
    //     {  "Bale Weight": "1 Ton", "Motor HP": "60 Hp", "Conveyor HP": "10 Hp" },
    //     {  "Bale Weight": "Custom", "Motor HP": "As per req", "Conveyor HP": "As per req" }
    //   ],
    //   applications: {
    //     materials: [
    //       "Corrugated Cardboard",
    //       "Office Paper, Newspapers, Magazines",
    //       "Mixed Paper Streams (sorted/unsorted)",
    //       "Lightweight Packaging Materials (e.g., kraft paper, fiberboard)"
    //     ],
    //     industries: [
    //       "Recycling Facilities",
    //       "E-commerce Warehouses (cardboard waste)",
    //       "Printing/Publishing Companies",
    //       "Municipal Waste Management Centers"
    //     ]
    //   }
    // },
    "continuous-baling-machine": {
      videoUrl: "https://www.youtube.com/watch?v=LEvW1g1pInQ&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=81",
      category: "Waste Management",
      name: "Continuous Baling Machine",
      tagline:"Relentless Power for High-Volume Metal Recycling",
      description: "The Continuous Metal Baler Machine is an automated solution tailored for high-standard, manpower-free plants. Integrated with a feeding conveyor system, this machine ensures seamless and efficient metal baling operations. Designed to handle large quantities of scrap metal with minimal human intervention, it enhances productivity and operational efficiency, making it ideal for large-scale recycling facilities that prioritize automation and quality. It can output 10 tons of scrap and more, depending on custom requirements.",
      image: [Contbaler],
      benifits:[
        "Maximize Revenue",
        "Reduce Downtime",
        "Cut Labor Costs",
        "Space Savings",
        "Smart Hopper",
        "Energy Saving Design"
      ],
      specifications: [
        { "Size": "8\" x 8\"", "Throughput / day": "25 tons Approx", "Bale Weight": "25 Kgs" },
        { "Size": "12\" x 12\"", "Throughput / day": "65 tons Approx", "Bale Weight": "50 Kgs" },
        { "Size": "14\" x 14\"", "Throughput / day": "100 tons Approx", "Bale Weight": "70 Kgs" }
      ],
      applications: {
        materials: [
          "Ferrous Metals (Steel, Iron, Auto Scrap)",
          "Non-Ferrous Metals (Aluminum, Copper, Brass)",
          "Mixed Metal Shredder Residue",
          "Sheet Metal, Wire, and Turnings"
        ],
        industries: [
          "Scrap Metal Yards",
          "Automative Manufacturing and other manufacturing recycling",
          "Electronics and Electricals recycling plants",
          "Foundries and Steel Mills"
        ]
      }
    },
    "continuous-scrapping-machine": {
      videoUrl: "https://www.youtube.com/watch?v=P7Uyso0uCIU&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=18",
      category: "Waste Management",
      name: "Continuous Scrapping Machine",
      tagline:"Unstoppable Efficiency for Scrap Cutting",
      description: "The Continuous Scrapper Machine is designed for high-speed, automated processing of both hollow and solid waste materials. Capable of handling large metal components and robust scrap, this machine maximizes operational efficiency by reducing manual intervention. The machine can process 20 tons of scrap and goes up to 40 tons of scrap in a day.",
      image: [Conscraper],
      benifits:[
        "Maximize Material Recovery",
        "Reduce Processing Time",
        "Lower Operational Costs",
        "Scalable Output",
        "Modular Attachments"
      ],
      specifications: [
        { "Input Size": "Up to 24\" x 24\"", "Output Size": "2\"-8\" Chips", "Throughput / day": "10-20 Tons" },
        { "Input Size": "Up to 36\" x 36\"", "Output Size": "2\"-8\" Chips", "Throughput / day": "10-20 Tons" }
      ],
      applications: {
        materials: [
          "Ferrous Metals (steel beams, automotive scrap, rebar)",
          "Non-Ferrous Metals (aluminum, copper cables, brass fixtures)",
          "Mixed Scrap (e-waste, appliances, industrial machinery)",
          "Light Contaminants (rubber, plastic-coated metals)"
        ],
        industries: [
          "Scrap Metal Recycling Facilities",
          "Automotive Dismantling Plants",
          "E-Waste Recycling Centers",
          "Scrap Metal Yards",
          "Automative Manufacturing and other manufacturing recycling",
          "Electronics and Electricals recycling plants",
          "Foundries and Steel Mills"
        ]
      }
    },
    "shredder-machine": {
      videoUrl: "https://www.youtube.com/watch?v=nSfz89qrw0U&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=65",
      category: "Waste Management",
      name: "Shredder Machine",
      tagline:"Cut through anything",
      description: "The Shredder Machine offers versatile shredding solutions for a wide range of materials, including plastics, metals, paper, and wood. Engineered with powerful motors and cutting-edge blade technology, it ensures efficient and fast material reduction. The durable construction and high-torque mechanism allow it to handle even the toughest waste with ease. It can process various materials like wood, metal, rubber, etc and shred up to 40 tons of scrap in a day.",
      image: [shredder],
      benifits:[
        "Volume Reduction: Cut storage and disposal costs by up to 80% with compact shredded output.",
        "Secure Destruction: Cross-cut or micro-cut blades ensure data security for sensitive documents/hard drives.",
        "Recycling Readiness: Uniformly shredded materials streamline sorting and melting processes.",
        "Low Maintenance: Self-sharpening blades and easy-access design reduce downtime."
      ],
      specifications: [
        { "Shredding Capacity": "500-800 Kg", "Max Material Thickness": "10 mm (Metal)", "Throughput/Hour": "1-2 Tons"},
        { "Shredding Capacity": "1-1.5 Tons", "Max Material Thickness": "15 mm (Metal)", "Throughput/Hour": "3-5 Tons"},
        { "Shredding Capacity": "2-3 Tons", "Max Material Thickness": "30 mm (Metal)", "Throughput/Hour": "6-9 Tons"}
      ],
      applications: {
        materials: [
          "Metals: Steel sheets, aluminum profiles, copper cables, automotive scrap",
          "Plastics: PET bottles, HDPE containers, PVC pipes, industrial plastic waste",
          "Paper/Cardboard: Confidential documents, corrugated boxes, mixed paper streams",
          "E-Waste: Circuit boards, hard drives, cables, appliances",
          "Organic Waste: Wood pallets, biomass, agricultural residues"
        ],
        industries: [
          "Scrap Metal Recycling Facilities",
          "E-Waste Recycling Centers",
          "Manufacturing Plants (post-production scrap)",
          "Waste Management Companies (bulk material processing)",
          "Government/Military (secure data disposal)"
        ]
      }
    },
    "jumbo-scrap-baling-press": {
      videoUrl: "https://www.youtube.com/watch?v=YilZOGydn8U&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=6",
      category: "Waste Management",
      name: "Jumbo Scrap Baling Press",
      tagline:"Power Meets Precision in Large-Scale Scrap Management",
      description: "The Jumbo Baling Press is engineered to handle high-volume baling operations with unmatched efficiency. It’s built for maximum durability, making it ideal for large-scale industries dealing with vast quantities of scrap material. This powerful machine ensures you achieve the highest compacting force with minimal operational effort. Custom-built to meet strict industrial requirements, it can handle invariable scrap and can process up to 25 tons of scrap a day.",
      image: [jumboscrapbaling],
      benifits:[
        "Slash Labor Costs: High Volume Optimizes for output for manpower constraints",
        "Maximize Storage Efficiency: Dense bales reduce floor space needs by up to 70%.",
        "Boost Profit Margins: High-density bales command premium pricing from recyclers.",
        "Durable and Breakdown Free Operations: Engineered for 100,000+ cycles with minimal wear",
        "Scalable Operations: Custom configurations for high-demand industries (e.g., steel mills, e-waste recyclers)."
      ],
      specifications: [
        { "Bale Size": "18\" x 18\"", "Bale Weight": "Up to 250 Kg", "Idle Cycle Time": "120 sec"},
        { "Bale Size": "20\" x 20\"", "Bale Weight": "Up to 350 Kg", "Idle Cycle Time": "140 sec"},
        { "Bale Size": "24\" x 24\"", "Bale Weight": "Up to 450 Kg", "Idle Cycle Time": "150 sec"}
      ],
      applications: {
        materials: [
          "Ferrous Metals (Small Rusty Steel Beams, Automotive Scrap, Machinery Parts)",
          "Non-Ferrous Metals (Aluminum Castings, Copper Wire Bundles)",
          "Mixed Industrial Scrap (Metal + Plastic Hybrid Waste)",
          "Textile Bulk Waste (Carpet, Fabric Rolls)",
          "Agricultural Waste (Plastic Mulch, Silage Wrap)"
        ],
        industries: [
          "Mega-Scale Recycling Facilities",
          "Steel and Aluminum Production Plants",
          "Textile Manufacturing Hubs",
          "Agricultural Cooperatives",
          "Manufacturing Plants (post-production scrap)",
          "Waste Management Companies (bulk material processing)"
        ]
      }
    },
    "car-baler-machine": {
      videoUrl: "https://www.youtube.com/watch?v=5duNf0eaYC0&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=30",
      category: "Waste Management",
      name: "Car Baler Machine",
      tagline:"Transform End-of-Life Vehicles into Compact, Recyclable Assets",
      description: "The Car Baler Machine is specifically designed for the automotive industry, providing a robust solution for compressing and baling old cars and metal remnants. It's built with heavy-duty components to withstand rigorous use, making it the go-to choice for automotive recyclers and government-oriented scrap yards and projects. It has capacity to output up to 800 Kg of bales and comes with a max compression force of 500 tons.",
      image: [carbalingmachine, carbalingmachine,carbalingmachine],
      benifits:[
        "Maximize Scrap Value: High-density bales attract premium prices from smelters and steel mills.",
        "Space Optimization: Reduce vehicle storage footprint by up to 90% for efficient yard management.",
        "Enhanced Safety: Eliminate sharp edges and hazardous loose debris with compact, uniform bales.",
        "Labor Savings: Automated systems minimize manual handling of bulky, dangerous scrap.",
        "Eco-Compliance: Streamline recycling processes to meet stringent environmental regulations."
      ],
      specifications: [
        { "Bale Size": "16\" x 16\"", "Bale Weight": "Up to 250 Kg (metal)", "Max Output/day": "40-80 Tons" },
        { "Bale Size": "18\" x 18\"", "Bale Weight": "Up to 350 Kg",  "Max Output/day": "80-120 Tons"},
        { "Bale Size": "Custom Bigger Size", "Bale Weight": "350+ Kg",  "Max Output/day": "120+ Tons" }
      ],
      applications: {
        materials: [
          "End-of-life vehicles (cars, trucks, buses)",
          "Automotive scrap (steel frames, aluminum engines, copper wiring)",
          "Government-seized vehicles (confiscated cars, damaged fleet vehicles)"
        ],
        industries: [
          "Automotive recycling facilities",
          "Government scrap yards and public waste projects",
          "Metal recovery plants processing ELV (End-of-Life Vehicles)",
          "Demolition companies handling fleet vehicles or industrial machinery"
        ]
      }
    },
    "bid-breaking-machine": {
  videoUrl: "https://www.youtube.com/watch?v=IVgorx7VVTs&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=11",
      category: "Waste Management",
      name: "Bid breaking machine",
      tagline:"Breaking the Unbreakable",
      description: "Built to process large, solid materials like ore boulders, engine castings, and scrap metal, our Bid Breaking Machine employs ultra-high hydraulic force to fragment tough materials into manageable pieces. It possess the ability to process up to 5 tons of non-conventional materials and comes with a pressing force of up to 1.5 K Tons.",
      image: [bidbreaking],
      benifits:["Ultra-High Hydraulic Force (1000+ Tons)",
        "Heavy Duty Built",
        "Efficient Design"
      ],
      specifications: [
        { "Bed Size": "4 x 6 ft",  "Idle Cycle Time sec": "60 sec", "Hydraulic Force": "600-800 Ton" },
        { "Bed Size": "5 x 7 ft",  "Idle Cycle Time sec": "60+ sec", "Hydraulic Force": "800-1000 Tons" },
        { "Bed Size": "Custom size",  "Idle Cycle Time sec": "As per req", "Hydraulic Force": "1000+ Tons" }
      ],
      applications: {
        materials: [
          "Ore boulders (iron, copper, gold)",
          "Engine blocks, gearboxes, and industrial castings",
          "Scrap metal slabs, steel beams, and machinery parts",
          "Demolition debris (concrete-reinforced metal, structural steel)",
          "Aerospace components (titanium, alloy remnants)"
        ]
      }
    },
    "scrap-shearing-machine-(kechi)": {
  videoUrl: "https://www.youtube.com/watch?v=Hs1SfCPpDrg&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=4",
      category: "Waste Management",
      name: "Scrap Shearing Machine (kechi)",
      tagline:"A Compact Cutting Solution",
      description: "Engineered for high-volume recycling operations, our Scrap Shearing Machine efficiently processes bulky metal scrap into compact, recyclable fragments. Powered by a high-torque hydraulic system, it delivers clean, forceful cuts through ferrous and non-ferrous materials, including steel, aluminum, and copper, without thermal distortion. Ideal for scrap yards, foundries, and metal recycling plants. It can cut through 25 mm solid material and possess cutting capacity of up to 400 tons.",
      image: [scrapshreaing],
      benifits:[
        "Maximize Material Recovery",
        "Maximize Scrap Value",
        "Durability Guarantee"
      ],
      specifications: [
        { "Input Size": "Up to 32 mm (round bar)", "Max Cuts / min": "30" },
        { "Input Size": "Up to 40 mm", "Max Cuts / min": "25" }
      ],
      applications: {
        materials: [
          "Ferrous Metals: Steel beams, rebar, automotive scrap, machinery parts",
          "Non-Ferrous Metals: Aluminum sheets, copper pipes, brass fixtures",
          "Mixed Scrap: Shredder residue, demolition waste, industrial castings",
          "Specialty Metals: Stainless steel, titanium aerospace components"
        ],
        industries: [
          "Scrap Metal Recycling Facilities",
          "Automotive Dismantling Plants",
          "E-Waste Recycling Centers",
          "Demolition and Construction Sites",
          "Manufacturing Plants (post-production scrap)"
        ]
      }
    },

    //Industrial Machines
    "ring-rolling-machine": {
      videoUrl: "https://www.youtube.com/watch?v=ND37x0Ajm7A&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=59",
      category: "Industrial Machines",
      name: "Ring Rolling Machine",
      tagline:"Precise Ring Forming",
      description: "Ring Rolling Machine is engineered for precision hot or cold forming of seamless metal rings, essential for applications in aerospace, energy, and heavy machinery. Equipped with advanced hydraulic systems, it ensures uniform material flow and exact dimensional tolerances for rings ranging from small bearings to large flanges. Customizable roller configurations adapt to various alloys, including steel, titanium, and copper, while integrated thermal management prevents deformation. It comes with capacity of materials with diameter between 150 to 400 mm, with thickness up to 100 mm.",
      image: [ringrolling],
      benifits:["Efficient Hydraulic System",
        "Heavy Duty Built",
        "High-Volume Readiness"
      ],
      specifications: [
        { "Ring Diameter": "Up to 200 mm", "Material Thickness": "10-20 mm", "Max. Ring Weight": "3 Kg"},
        { "Ring Diameter": "Up to 350 mm", "Material Thickness": "20-30 mm", "Max. Ring Weight": "5 Kg"},
        { "Ring Diameter": "Custom Size", "Material Thickness": "30+ mm", "Max. Ring Weight": "5+ Kg"}
      ],
      applications: {
        materials: [
          "Ferrous Metals: Major Types",
          "Steel Alloys: Carbon steel, stainless steel.",
          "High-Temp Alloys: Inconel, Hastelloy, nickel-based superalloys.",
          "Non-Ferrous: Copper, brass, bronze."
        ],
        industries: [
          "Aerospace: Engine casings, turbine discs, landing gear rings.",
          "Energy: Wind turbine hubs, nuclear reactor flanges, oil rig components.",
          "Heavy Machinery: Gears, bearings, hydraulic cylinder bands.",
          "Automotive: Transmission rings, EV battery housings.",
          "Defense: Armored vehicle wheel rims, missile guidance systems."
        ]
      }
    },

    "cold-shearing-machine": {
      videoUrl: "https://www.youtube.com/watch?v=63yRDWemk58&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=68",
      category: "Industrial Machines",
      name: "Cold Shearing Machine",
      tagline:"Cut Billets at Unmatched Speed, Zero Heat, Zero Waste.",
      description: "The Cold Shearing Machine is an innovative solution for fast and efficient billet production. Designed for volume production, this machine eliminates the need for traditional banshaw usage, offering an automatic and streamlined shearing process. Its robust construction and advanced technology ensure precise billet size cutting and high-speed operations, making it an essential tool for industries aiming to enhance their billet production capabilities. It can easily cut through solids of up to 80 mm in diameter in a single shot. It comes with a capacity of 1200 tons of force.",
      image: [coldshearing],
      benifits:[
        "Boost Productivity: Cut 5x faster than traditional bandsaws with no manual intervention.",
        "Maximize Material Yield: Near-zero kerf loss reduces waste and material costs.",
        "Labor Savings: Fully automated workflow slashes staffing needs by up to 70%."
      ],
      specifications: [
        { "Max Billet Size": "40 x 40 mm", "Cycle Time": "8-16 Sec" },
        { "Max Billet Size": "Up to 60 x 60 mm", "Cycle Time": "12-20 Sec" },
        { "Max Billet Size": "Up to 100 x 100 mm", "Cycle Time": "16-24 Sec"},
        { "Max Billet Size": "Custom Size", "Cycle Time": "24+ Sec" }
      ],
      applications: {
        materials: [
          "Ferrous Steel: Carbon steel, alloy steel, stainless steel.",
          "Non-Ferrous: Aluminum, copper, brass billets.",
          "Custom Profiles: Round, square, or rectangular cross-sections."
        ],
        industries: [
          "Forging Plants",
          "Metal Billet Plants"
        ]
      }
    },

    "heavy-duty-lathe-machine": {
      category: "Industrial Machines",
      name: "Heavy Duty Lathe Machine",
      tagline:"Customized Precision on Any Scale",
      description: "The Lathe Machine is versatile and customizable, designed to handle operations from small precision components to large workpieces meters in length. Each machine is built to your specific requirements, ensuring it meets the unique demands of your workshop or factory. With precision engineering, the Lathe Machine delivers smooth and stable turning, shaping, and drilling operations. It can process jobs from 5 mm to 500 mm diameter, and up to 14 meters in length (between tail stock distance).",
      image: [heavylathe],
      benifits:[
        "Cost-Effective Customization: Pay only for features your operations require.",
        "Durability: Hardened guideways and tempered gears withstand decades of heavy use."
      ],
      specifications: [
        { "Max Length": "3-6 Meters", "Max Diameter": "800 mm", "Motor Power hp": "3" },
        { "Max Length": "6-9 Meters", "Max Diameter": "1200 mm", "Motor Power hp": "5" },
        { "Max Length": "9+ meters", "Max Diameter": "Custom size", "Motor Power hp": "custom" }
      ],
      applications: {
        materials: [
          "Metals: Steel, stainless steel, aluminum, etc.",
          "Plastics: Engineering-grade polymers, PTFE, nylon.",
          "Composites: Carbon fiber, fiberglass-reinforced materials.",
          "Custom Applications: Rotors, shafts, flanges, gears, and prototypes."
        ],
        industries: [
          "Automotive: Crankshafts, brake drums, transmission components.",
          "Aerospace: Turbine blades, landing gear parts, engine housings.",
          "Energy: Wind turbine shafts, pipeline valves, hydraulic cylinders.",
          "Marine: Propeller shafts, rudder stocks, dock machinery.",
          "General Manufacturing: Custom molds, rollers, and industrial tooling"
        ]
      }
    },
    "number-punching-machine": {
  videoUrl: "https://www.youtube.com/watch?v=EtuiNHwGpYs&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=9",
      category: "Industrial Machines",
      name: "Number Punching Machine",
      tagline:"Precision Marking, From Micro to Macro",
      description: "The Number Punching Machine is highly compact and efficient, designed to handle a wide range of circular jobs from diameter sizes from 30 mm to 300 mm and thickness range from 5 mm to 50 mm. Ideal for precise number punching tasks, this versatile machine ensures accuracy and reliability in all your marking applications.",
      image: [numberpunch],
      benifits:[
        "Error-Free Marking",
        "Time Savings",
        "Adaptability",
        "Cost-Effective"
      ],
      specifications: [
        { "Diameter Range": "40-150 mm", "Stroke / min": "10-30", "Motor Power": "2 Hp" },
        { "Diameter Range": "Custom Size", "Stroke / min": "-", "Motor Power": "-" }
      ],
      applications: {
        materials: [
          "Metals: Steel, aluminum, brass, copper.",
          "Plastics: ABS, PVC, polycarbonate.",
          "Composites: Fiberglass, carbon fiber panels.",
          "Engineered Materials: Ceramics (with specialized tooling)."
        ],
        industries: [
          "Forging: Rings and circular objects",
          "General Manufacturing of round objects"
        ]
      }
    },

    "sheet-slitting-machine": {
  videoUrl: "https://www.youtube.com/watch?v=TdWAzGiwmxk&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=86",
      category: "Industrial Machines",
      name: "Sheet Slitting Machine",
      tagline:"Precision Slitting, Uninterrupted Productivity",
      description: "The Sheet Slitting Machine is designed to provide precise and efficient slitting of various materials. Equipped with a decoiler and a cut-to-length setup, it offers seamless operation for continuous production. This machine is ideal for industries requiring consistent and accurate slitting, ensuring minimal material wastage and maximized productivity. The machine can handle coils up to 2.5 meters in diameter with maximum thickness of 6 mm.",
      image: [sheetslit],
      benifits:[
        "Time Savings",
        "Portable Design",
        "Cost-Effective"
      ],
      specifications: [
        { "Max Material width": "1000 mm", "Thickness": "8 mm", "Strokes / Hour": "20", "Servo Motor Power": "7.5 KW" },
        { "Max Material width": "Custom Size", "Thickness": "-", "Strokes / Hour": "-", "Servo Motor Power": "-" }
      ],
      applications: {
        materials: [
          "Metals: Steel coils, aluminum sheets, copper foils.",
          "Plastics: PVC, PET, polypropylene films.",
          "Composites: Fiberglass, carbon fiber laminates.",
          "Specialty Materials: Adhesive tapes, insulating films, flexible circuits."
        ],
        industries: [
          "Metal Fabrication: Automotive body panels, HVAC components, roofing sheets.",
          "Packaging: Film slitting for food wrappers, labels, and industrial packaging.",
          "Electronics: Precision slitting for flexible circuits, battery foils, and insulation."
        ]
      }
    },

    //Special Purpose Machines
    "di-pipe-breaking-machine": {
  videoUrl: "https://www.youtube.com/watch?v=bnyDFZJaJ_k&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=25",
      category: "Special Purpose Machines",
      name: "DI Pipe Breaking Machine",
      tagline:"Revolutionizing Pipe Recycling and boosting operational efficiency",
      description: "The DI Pipe Breaking Machine falls under the SPM category, specifically created to recycle pipes and similar products for manufacturing plants. This automated machine features a conveyor feeding system that ensures smooth material handling. The broken pipes are fed out through a conveyor system that leads into a magnetic separator and dust separator, ensuring clean and efficient recycling. This solution can recover 95% waste from pipes up to 1200 mm in diameter with capacity of 25 tons a day.",
      image: [dipipe],
      benifits:[
        "Boost operational efficiency",
        "Reduce Manufacturing waste",
        "Efficient waste management and recovery"
      ],
      specifications: [
        { "Max pipe diameter": "1000 mm", "Thickness": "8 mm", "output / day": "60-70 Ton", "Motor Power": "50 HP" },
        { "Max pipe diameter": "1250 mm", "Thickness": "10 mm", "output / day": "80-100 Ton", "Motor Power": "75 HP" },
        { "Max pipe diameter": "Custom Size", "Thickness": "-", "output / day": "-", "Motor Power": "-" }
      ],
      applications: {
        materials: [
          "Ductile Iron (DI) Pipes",
          "Cast Iron Pipes",
          "Concrete-Lined Metal Pipes",
          "Mixed Construction Debris (with ferrous content)"
        ],
        industries: [
          "Pipe manufacturing plants",
          "Construction industry",
          "Recycling industry"
        ]
      }
    },
    "pipe-hydrotest-machine": {
      category: "Special Purpose Machines",
      name: "Pipe Hydrotest Machine",
      tagline:"Uncompromised Safety checking for Pipelines",
      description: "A semi-automatic Special Purpose Machine (SPM) designed to rigorously test the integrity and leak resistance of large-diameter pipes, ensuring compliance with global safety and quality standards. Capable of handling pipes up to 3 meters in diameter, this machine uses high-pressure water injection to simulate extreme operating conditions, identifying weaknesses, cracks, or flaws in pipelines. The semi-automatic system features variable pressure cycles, real-time digital monitoring, and automated shut-off valves to prevent over-pressurization. The machine can handle pipes up to 750 mm in diameter and 6 meters in length, with a maximum pressure of 500 bar.",
      image: [pipehydro],
      benifits:[
        "Boost production quality",
        "Maintain PESTAL Compliance",
        "Leak visualization"
      ],
      specifications: [
        { "Max pipe diameter": "2500 mm", "Pressure Range": "5-50 bar", "Automation level": "Semi", "Motor Power": "50 hp", "Water Pump": "30 KW" },
        { "Max pipe diameter": "Custom Size", "Pressure Range": "-", "Automation level": "Semi / auto cycle", "Motor Power": "-", "Water Pump": "-" }
      ],
      applications: {
        materials: [
          "Metal pipes: Steel, ductile iron, stainless steel.",
          "Plastics: PVC, HDPE, reinforced composites.",
          "Concrete-Lined Pipes: Pre-stressed or hybrid materials.",
          "Coated Pipes: Epoxy, bitumen, or corrosion-resistant layers."
        ],
        industries: [
          "Pipe manufacturing plants.",
          "Oil & Gas: Subsea pipelines, refinery networks.",
          "Water Infrastructure: Municipal supply lines, sewage systems.",
          "Industrial Manufacturing: Chemical plant piping, HVAC ducting.",
          "Construction: Tunnel boring pipelines, geothermal installations.",
          "Energy: CO2 transport lines, hydrogen fuel pipelines."
        ]
      }
    },
    "big-pipe-gauging-and-sizing-machine": {
      category: "Special Purpose Machines",
      name: "Big Pipe Gauging and Sizing Machine",
      tagline:"Engineered for Correcting Pipeline Geometry",
      description: "The Machine verifies the dimensional accuracy of large pipes, ensuring adherence to strict tolerances for diameter, ovality, and straightness. Equipped with contact probes, and rotary encoders, it automatically measures and records geometric parameters of pipes up to 4 meters in diameter and 12 meters in length. The adjustable mandrel and roller system accommodates varying pipe materials, while a user-friendly HMI interface allows operators to set tolerance thresholds and generate compliance reports. The machine can straighten pipes of up to 12 meters in a single shot with diameters ranging from 500 mm to 2500 mm.",
      image: [gauginsizing],
      benifits:[
        "Eliminate Rework Costs",
        "Regulatory Compliance",
        "Faster Approvals",
        "Versatile Adaptation",
        "Boost Operational Efficiency"
      ],
      specifications: [
        { "Max pipe diameter": "2500 mm", "Max Pipe Pressure": "5-50 bar", "Automation level": "Semi", "Motor Power": "50 hp" },
        { "Max pipe diameter": "Custom Size", "Max Pipe Pressure": "-", "Automation level": "Semi / auto cycle", "Motor Power": "-" }
      ],
      applications: {
        materials: [
          "Metal pipes: Steel, ductile iron, stainless steel.",
          "Plastics: PVC, HDPE, reinforced composites.",
          "Concrete/Steel Hybrids: Pre-stressed or lined pipelines.",
          "Coated Pipes: Anti-corrosion layers, epoxy finishes."
        ],
        industries: [
          "Pipe manufacturing plants.",
          "Oil & Gas: Subsea pipelines, refinery networks.",
          "Water Infrastructure: Municipal supply lines, sewage systems.",
          "Industrial Manufacturing: Chemical plant piping, HVAC ducting.",
          "Construction: Tunnel boring pipelines, geothermal installations.",
          "Energy: CO2 transport lines, hydrogen fuel pipelines."
        ]
      }
    },
    "hydraulic-press-(customized)": {
  videoUrl: "https://www.youtube.com/watch?v=W4PyX6B_4lY",
      category: "Special Purpose Machines",
      name: "Hydraulic Press (customized)",
      tagline:"Power Meets Precision for Every Industrial Challenge",
      description: "Our Hydraulic Press range spans from 50-ton to 5000-ton capacity, catering to various industrial needs from standard pressing to heavy-duty tasks like bid breaking and cast iron crushing. Known for its durability, each press is built to last for decades under rigorous use. The hydraulic control mechanisms provide smooth, high-precision operations, making it suitable for applications requiring both power and finesse. Customizable to your specific requirements, the Hydraulic Press is a reliable and robust solution for industries demanding exceptional performance and longevity.",
      image: [hydraulic_cus],
      benifits:[
        "Wide customization",
        "Cost Efficiency",
        "Durability",
        "Precision Control"
      ],
      specifications: [
        { "Pressing Capacity": "50-100 Ton", "Motor Power": "15 Hp" },
        { "Pressing Capacity": "100-150 Ton", "Motor Power": "25 Hp" },
        { "Pressing Capacity": "150-300 Ton", "Motor Power": "50 Hp" },
        { "Pressing Capacity": "300-500 Ton", "Motor Power": "60 Hp" },
        { "Pressing Capacity": "Custom",  "Motor Power": "" }
      ],
      applications:["Metal Forming: Stamping, bending, and deep drawing of steel, aluminum, and alloys.",
                  "Recycling: Crushing scrap metal, breaking boulders, and compacting waste.",
                  "Manufacturing: Molding, punching, and assembly of automotive or industrial parts.",
                  "Construction: Testing concrete blocks, crushing aggregates, and forming structural components.",
                  "Aerospace: Precision pressing of turbine blades, fuselage panels, and landing gear."
                  ]
    },
    'sheet-plate-bending-machine': {
      category: "Special Purpose Machines",
      name: "Sheet Plate Bending Machine",
      tagline:"",
      description: "Designed for shaping metal plates and sheets into arcs, cylinders, or complex profiles, our hydraulic Plate/Sheet Bending Machine delivers features include angle presets, automatic clamping, and overload protection for operator safety. Optional conveyor-fed loading systems streamline high-volume tasks in shipbuilding, construction, and automotive industries. With quick-change tooling and minimal setup time, this machine enhances productivity while maintaining stringent quality standards for structural and decorative components. The machine can process sheets with span of up to 4 meters and 20 mm thickness.",
      image: [sheetbending],
      benifits:[],
      specifications: [],
      applications:[]
    },
    "manual-paper-baling-machine": {
  videoUrl: "https://www.youtube.com/watch?v=qZm_yNlncs8&list=PL0HiGy1JO9LHUZOR3pLKlErnsftIGL-VE&index=32",
      category: "Special Purpose Machines",
      name: "Manual paper baling machine",
      tagline:"Compact, Efficient, and Built for Small-Scale Recycling",
      description: "A compact, user-friendly solution for recycling facilities, this manual baling machine efficiently compresses paper, cardboard, and lightweight plastics into dense, stackable bales. Constructed with reinforced steel frames and a heavy-duty compression chamber, it handles volumes up to 500 kg with an adjustable lever system for customizable bale sizes. Ergonomic handles and safety locks ensure easy operation and prevent accidental release. Portable and maintenance-free, it optimizes storage space and reduces transportation costs for small to medium enterprises.",
      image: [manualpaperbaler],
      benifits:["Reinforced Steel Frame", "Adjustable Lever System", "Heavy-Duty Compression Chamber", "Ergonomic Design"],
      specifications: [
        { "Max Bale Weight": "500 Kg", "Motor Power": "45 Hp" },
        { "Max Bale Weight": "Custom Size", "Motor Power": "As per req" }
      ],
      applications: {
        materials: [
          "Paper: Office waste, newspapers, magazines.",
          "Cardboard: Corrugated boxes, packaging materials.",
          "Plastics: PET bottles, HDPE containers, plastic films."
        ],
        industries: [
          "Small Recycling facilities",
          "E-commerce warehouse",
          "City Scale recyclers",
          "Industrial recyclers"
        ]
      }
    },

}
  
export default productsData;