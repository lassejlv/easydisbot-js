class EmbedBuilder {
  constructor() {
    this.fields = [];
    this.title = null;
    this.description = null;
    this.color = null;
    this.footer = null;
    this.image = null;
    this.thumbnail = null;
    this.author = null;
    this.url = null;
    this.timestamp = null;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setFooter(text, iconUrl) {
    this.footer = {
      text,
      icon_url: iconUrl,
    };
    return this;
  }

  setImage(url) {
    this.image = {
      url,
    };
    return this;
  }

  setThumbnail(url) {
    this.thumbnail = {
      url,
    };
    return this;
  }

  setAuthor(name, iconUrl, url) {
    this.author = {
      name,
      icon_url: iconUrl,
      url,
    };
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setTimestamp(timestamp) {
    if (timestamp instanceof Date) {
      this.timestamp = timestamp.toISOString();
    } else {
      this.timestamp = timestamp;
    }
    return this;
  }

  addField(name, value, inline = false) {
    this.fields.push({
      name,
      value,
      inline,
    });
    return this;
  }

  build() {
    return {
      title: this.title,
      description: this.description,
      color: this.color,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      author: this.author,
      url: this.url,
      timestamp: this.timestamp,
      fields: this.fields,
    };
  }
}

module.exports = {
  EmbedBuilder,
};
