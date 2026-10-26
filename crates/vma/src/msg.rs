//! Error messages with the app's translation keys.

/// An error message: the app's translation key with its parameters (`tf(key, params)`; the key is
/// empty where the JS compiler gives a plain text too) and the English text the CLI prints.
/// Parameters starting with `_` are the JS composition: `_prefix` ("LOOP: " + t(key)), `_suffix`
/// (t(key) + " " + suffix), `_replace` (the IRQ_SETUP of the text replaced by it).
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Msg {
    pub key: &'static str,
    pub params: Vec<(&'static str, String)>,
    pub text: String,
}

impl Msg {
    pub fn keyed(key: &'static str, text: impl Into<String>) -> Msg {
        Msg { key, params: Vec::new(), text: text.into() }
    }
    pub fn p(mut self, name: &'static str, value: impl ToString) -> Msg {
        self.params.push((name, value.to_string()));
        self
    }
}

impl From<String> for Msg {
    fn from(text: String) -> Msg {
        Msg { key: "", params: Vec::new(), text }
    }
}

impl From<&str> for Msg {
    fn from(text: &str) -> Msg {
        Msg::from(text.to_string())
    }
}
