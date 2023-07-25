exports.getError = (req, res, next) => {
    res.status(404).render("error", { docTitle: "404 - Page not found", path: "" });
}