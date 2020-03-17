const notesController = {};

const Note = require('../models/Note');

notesController.renderNoteForm = (req, res) => {
    res.render('notes/new-note');
};

notesController.createNewNote = async (req, res) => {
    const { title, description } = req.body;
    const newNote = new Note({title, description });
    newNote.user = req.user.id;
    //console.log(newNote);
    await newNote.save();
    req.flash('success_msg','Note Added Successfuly');
    res.redirect('/notes');
};

notesController.renderNotes = async (req, res) => {
    console.log('getting all Notes');
    const listNotes = await Note.find({user: req.user.id}).sort({createdAt:'desc'});
    res.render('notes/all-notes',{listNotes});
};

notesController.renderEditForm = async (req, res) => {
    const note = await Note.findById(req.params.id);
    if(note.user != req.user.id){
        req.flash('error_msg','Not Authorized');
        return res.redirect('/notes');
    }
    res.render('notes/edit-note', {note});
};

notesController.updateNote = async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg','Note Updated Successfuly');
    res.redirect('/notes');
};

notesController.deleteNote = async (req, res) => {
    console.log("id to delete "+req.params.id);
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Note Deleted Successfuly');
    res.redirect('/notes');
};
module.exports = notesController;