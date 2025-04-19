const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_select') {
        const category = interaction.values[0];
        const existingChannel = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
        if (existingChannel) {
          return interaction.reply({ content: 'Zaten açık bir ticket\'ınız var!', ephemeral: true });
        }

        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            }
          ]
        });

        await ticketChannel.send(`📨 Merhaba ${interaction.user}, ${category} kategorisi için ticket açtınız. Ekibimiz kısa sürede sizinle ilgilenecek.`);
        await interaction.reply({ content: 'Ticket başarıyla açıldı!', ephemeral: true });
      }
    }
  }
};
