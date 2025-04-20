const { Client, GatewayIntentBits, Partials, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const TOKEN = 'YOUR_BOT_TOKEN';
const GUILD_ID = 'YOUR_GUILD_ID';
const CATEGORY_ID = 'YOUR_TICKET_CATEGORY_ID'; // destek ticket kanallarının oluşturulacağı kategori ID'si

client.once(Events.ClientReady, () => {
    console.log(`Bot giriş yaptı: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const existingChannel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (existingChannel) {
            await interaction.reply({ content: 'Zaten bir açık ticketiniz var.', ephemeral: true });
            return;
        }

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: CATEGORY_ID,
            topic: interaction.user.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
                {
                    id: client.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
            ],
        });

        const embed = new EmbedBuilder()
            .setTitle('Destek Talebi')
            .setDescription('Destek ekibi en kısa sürede sizinle ilgilenecektir.')
            .setColor(0x00AE86);

        const closeButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Kapat')
            .setStyle(ButtonStyle.Danger);

        await ticketChannel.send({
            content: `<@${interaction.user.id}>`,
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(closeButton)],
        });

        await interaction.reply({ content: `Ticket kanalınız oluşturuldu: ${ticketChannel}`, ephemeral: true });
    }

    if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel;
        await channel.send('Ticket 5 saniye içinde kapatılacak...');
        setTimeout(() => channel.delete(), 5000);
    }
});

client.on(Events.ClientReady, async () => {
    const channel = await client.channels.fetch('YOUR_CHANNEL_ID');
    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle('Destek Sistemi')
            .setDescription('Destek almak için aşağıdaki butona tıklayın.')
            .setColor(0x00AE86);

        const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Destek Oluştur')
            .setStyle(ButtonStyle.Primary);

        channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
    }
});

const TOKEN = process.env.DISCORD_TOKEN;

client.login(TOKEN);
