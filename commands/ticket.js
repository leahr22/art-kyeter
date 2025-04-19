const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket sistemi menüsünü gönderir.'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ticket_select')
        .setPlaceholder('Ticket Açmak İçin Kategori Seçiniz.')
        .addOptions([
          {
            label: 'Satın Alma',
            value: 'satinalma',
            description: 'Ürün veya hizmet satın almak için.'
          },
          {
            label: 'Destek',
            value: 'destek',
            description: 'Herhangi bir konuda destek almak için.'
          }
        ])
    );

    await interaction.reply({
      content: '**🎟️ Destek Sistemi**\nKategori seçerek ticket açabilirsiniz.',
      components: [row],
      ephemeral: true
    });
  }
};
