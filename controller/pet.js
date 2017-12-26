var Pet = require('../models/pet');

var postPets = function(req, res) {
    var pet = new Pet();
    pet.name = req.body.name;
    pet.type = req.body.type;
    pet.quantity = req.body.quantity;
    pet.userId = req.user._id;

    console.log(req.user)

    pet.save(function(err) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pet });
    });
};

var getPets = function(req, res) {
    Pet.find({ userId: req.user._id }, function(err, pets) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pets });
    });
};

var getPet = function(req, res) {
    Pet.findById({ userId: req.user._id, _id: req.params.pet_id }, function(err, pet) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pet });
    });
};

var updatePet = function(req, res) {
    Pet.update({ userId: req.user._id, _id: req.params.pet_id }, { quantity: req.body.quantity }, function(err, num) {
        if (err) {
            res.json({ message: 'error', data: err });
        }
        res.json({ message: ' update' })
    })

    // Pet.findById(req.params.pet_id, function(err, pet) {
    //     if (err) {
    //         res.json({ message: 'error', data: err });
    //         return;
    //     }
    //     pet.quantity = req.body.quantity;

    //     pet.save(function(err) {
    //         if (err) {
    //             res.json({ message: 'error', data: err });
    //             return;
    //         }

    //         res.json({ message: 'done', data: pet });
    //     })
    // });
};

var deletePet = function(req, res) {
    Pet.remove({ userId: req.user._id, _id: req.params.pet_id }, function(err) {
        if (err) {
            res.json({ message: 'error', data: err });
        }
        res.json({ message: 'pet remove!' })
    });

    // Pet.findByIdAndRemove(req.params.pet_id, function(err) {
    //     if (err) {
    //         res.json({ message: 'error', data: err });
    //         return;
    //     }

    //     res.json({ message: 'done', data: {} });
    // });
};

module.exports = {
    postPets: postPets,
    getPets: getPets,
    getPet: getPet,
    updatePet: updatePet,
    deletePet: deletePet
}