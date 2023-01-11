"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          name: "Air Jordan 2 Retro 'Chicago' 2022",
          price: 4500000,
          description:
            "The 2022 edition of the Air Jordan 2 Retro ‘Chicago’ brings back the legacy silhouette in its original 1986 form. A radical design departure from its predecessor, the sneaker discards Nike Swoosh branding while introducing the Jordan ‘Wings’ logo atop the tongue. Black laces secure a white leather upper appointed with sleek lines, perforated detailing, and a faux lizard skin overlay inspired by luxury footwear. A crimson heel counter provides a contrasting pop of color, while a Nike wordmark decorates the rear collar. Traditional cupsole tooling is replaced by a black polyurethane midsole with encapsulated Air-sole cushioning.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673246003/JKT48/wyjml9nknykhrnh21l3r.png",
          stock: 200,
          CategoryId: 1,
          color: "from-blue-600 to-blue-500 shadow-lg shadow-blue-500",
        },
        {
          name: "Air Jordan 4 Retro PS 'Military Black'",
          price: 1800000,
          description:
            "The Air Jordan 4 Retro ‘Military Black’ showcases the same color blocking and materials featured on the OG ‘Military Blue’ colorway from 1989. Smooth white leather is utilized on the upper, bolstered with a forefoot overlay in grey suede. Contrasting black accents make their way to the TPU eyelets, molded heel tab, and the Jumpman logo displayed on the woven tongue tag. Lightweight cushioning comes courtesy of a two-tone polyurethane midsole, enhanced with a visible Air-sole unit under the heel.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673248156/JKT48/ugimwwimrzdqou3mbkyn.png",
          stock: 88,
          CategoryId: 1,
          color: "from-red-500 to-rose-500 shadow-lg shadow-rose-500",
        },
        {
          name: "Wmns Air Jordan 1 Low SE 'Homage'",
          price: 1700000,
          description:
            "The women’s Air Jordan 1 Low SE ‘Homage’ showcases split color blocking that recalls the ‘Homage to Home’ Air Jordan 1 High from 2018. The tumbled leather upper on each shoe features a white base with contrasting black overlays on the lateral side, and a black base with white overlays on the medial side. The split theme extends to the Jumpman tongue tag and the Wings logo embroidered on the heel. Both shoes are mounted on a rubber cupsole, highlighted by white sidewalls and a black rubber outsole.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673263399/JKT48/kvuviz4ewh1d0zjegrwd.png",
          stock: 45,
          CategoryId: 1,
          color: "from-violet-500 to-indigo-500 shadow-lg shadow-violet-500",
        },
        {
          name: "Dunk Low SB 'Sandy Bodecker'",
          price: 2800000,
          description:
            "The Nike Dunk Low SB ‘Sandy Bodecker’ features a unique design inspired by the one-of-one Charity Dunk from 2003. The low-top utilized a patent leather upper dressed in the signature colors of eBay, the popular site where the shoe was sold in a charity auction benefiting Portland area skateparks. Left a mystery for years, the mystery winner was eventually revealed to be Sandy Bodecker, the ‘patriarch of Nike Skateboarding.’ Nike ensured that the shoe was limited to a quantity of one by destroying the sample pair, something that’s recreated here through the use of translucent chopped-up windows. Inside the shoe, custom photograph insoles courtesy of designer James Arizumi display images honoring Sandy Bodecker’s enduring legacy.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673259723/JKT48/lsvw0yq6g8gy7vq98gpc.png",
          stock: 169,
          CategoryId: 1,
          color: "from-sky-600 to-indigo-600 shadow-lg shadow-blue-500",
        },
        {
          name: "Dunk Low Pro SB 'Bart Simpson'",
          price: 2400000,
          description:
            "The Nike Dunk Low Pro SB ‘Bart Simpson’ features a familiar color palette that recalls the eldest Simpson child, making the shoe the spiritual successor to the ‘Marge’ Dunk from 2008 and ‘Homer’ Dunk from 2004. The upper combines a yellow leather base with a white leather Swoosh and suede overlays in Habanero Red. Contrasting hits of Blue Hero make their way to the collar lining and rubber outsole. Inside the shoe, the Nike SB insole packs a Zoom Air unit in the heel for lightweight cushioning.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673250307/JKT48/fac8euaaw8mufbqctfly.png",
          stock: 76,
          CategoryId: 1,
          color: "from-green-500 to-emerald-500 shadow-lg shadow-green-500",
        },
        {
          name: "Salehe Bembury x 990v2 Made in USA 'Sand Be The Time'",
          price: 3900000,
          description:
            "The Salehe Bembury x New Balance 990v2 Made in USA ‘Sand Be The Time’ continues the creative partnership between the prolific footwear designer and Boston-based sportswear brand. Their fifth joint venture presents a pastel colorway of the retro lifestyle runner, featuring pink hairy suede paneling with tonal open-cell mesh at the toe box and collar. A purple chenille ‘N’ logo decorates the quarter panel, while Bembury’s signature fingerprint graphic appears on the back heel. The layered build rides on a salmon-colored ABZORB midsole, reinforced underfoot by a durable purple rubber outsole.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673253263/JKT48/ps51g5nhggzfqmzhmetf.png",
          stock: 13,
          CategoryId: 1,
          color: "from-red-500 to-rose-500 shadow-lg shadow-rose-500",
        },
        {
          name: "Teddy Santis x 990v3 Made in USA 'White Blue'",
          price: 7800000,
          description:
            "The Teddy Santis x New Balance 990v3 Made in USA ‘White Blue’ revives the third iteration of the vaunted 990 franchise. This pair sports a mixed-material upper composed of white mesh, grey suede, and white leather. Contrasting hits of color arrive via forefoot and collar overlays in black and royal blue. The latter hue makes repeat appearances on the sneaker’s branding elements, including the large ‘N’ logo that graces the quarter panel. New Balance’s ENCAP midsole, built with lightweight foam and a durable polyurethane rim, yields a comfortable ride.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673256936/JKT48/qghjpe2be6jb4cx4grxp.png",
          stock: 24,
          CategoryId: 1,
          color: "from-orange-500 to-amber-500 shadow-lg shadow-orange-500",
        },
        {
          name: "Yeezy Boost 350 V2 'Beluga Reflective'",
          price: 4300000,
          description:
            "The adidas Yeezy Boost 350 V2 ‘Beluga Reflective’ brings back the 2016 colorway with a twist. Like the original ‘Beluga’ release, this pair features a predominantly grey Primeknit upper with an orange side stripe marked with SPLY-350 branding. Interwoven throughout the knit build are reflective fibers that offer enhanced visibility in low-light conditions. The sneaker’s tooling remains unchanged, highlighted by a full-length Boost midsole wrapped in a semi-translucent rubber cage.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673257547/JKT48/x0spec1i67ajlv19kvkc.png",
          stock: 211,
          CategoryId: 1,
          color: "from-gray-900 to-yellow-500 shadow-lg shadow-yellow-500",
        },
        {
          name: "Travis Scott x Air Jordan 1 Low OG 'Reverse Mocha'c",
          price: 23000000,
          description:
            "The Travis Scott x Air Jordan 1 Low OG ‘Reverse Mocha’ delivers a twist on the original ‘Mocha’ AJ1 Low from 2019. The upper combines a brown suede base with ivory leather overlays and the Houston rapper’s signature reverse Swoosh on the lateral side, featuring oversized dimensions and a neutral cream finish. Contrasting scarlet accents distinguish a pair of woven Nike Air tongue tags, as well as mismatched Cactus Jack and retro Wings logos embroidered on each heel tab. A vintage off-white rubber midsole is bolstered with encapsulated Nike Air cushioning in the heel and a brown rubber outsole underfoot.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673258324/JKT48/zqlce61brsbxaxyafwye.png",
          stock: 16,
          CategoryId: 1,
          color: "from-blue-600 to-blue-500 shadow-lg shadow-blue-500",
        },
        {
          name: "Yeezy Boost 350 V2 'Flax'",
          price: 3200000,
          description:
            "The Yeezy Boost 350 V2 'Flax' dons a breathable Primeknit upper in an understated wheat hue, complemented by tonal rope laces and a post-dyed monofilament side stripe tinted in a muted yellow finish. The lightweight knit build rides on a full-length Boost midsole, partially visible beneath a semi-translucent rubber cage with ridged detailing. The 'Flax' colorway is available only in Asia Pacific, Africa, India and the Middle East.",
          imgUrl:
            "https://res.cloudinary.com/dqschoc1m/image/upload/v1673259207/JKT48/qgywzjg3l8ki0lwapbfs.png",
          stock: 242,
          CategoryId: 1,
          color: "from-red-500 to-rose-500 shadow-lg shadow-rose-500",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
