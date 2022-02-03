const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint
// find all categories
// be sure to include its associated Products

router.get('/', async(req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // find one category by its `id` value
  // be sure to include its associated Products
  router.get('/:id', async (req, res) => {
    try {
      const categoryData = await Category.findByPk(req.params.id, {
        include: [{ model:Product }],
      });
      if (!categoryData) {
        res.status(404).json({ message: 'No category data found with that id!' });
        return;
      }
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then((createdCategory) => res.status(200).json(createdCategory))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
  // update a category by its `id` value
router.put('/:id', (req, res) => {

  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from CatagoryTag
    res.status(200).json(category)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


   // delete a category by its `id` value
router.delete('/:id', async (req, res) => {
    try {
      const categoryData = await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      if (!categoryData) {
        res.status(404).json({ message: 'No category found with that id!' });
        return;
      }
  
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
