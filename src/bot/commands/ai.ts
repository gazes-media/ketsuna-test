import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, CommandInteraction, CommandInteractionOptionResolver, MessageFlags, SlashCommandBuilder } from "discord.js";
import Bot from "../index";
import CommandsBase from "./baseCommands";
import Login from "./ai/login";
import Imagine from "./ai/imagine";
import Help from "./ai/help";
import Info from "./ai/info";
import Ask from "./ai/ask";
import Logout from "./ai/logout";
import Interogate from "./ai/interogate";
import { ModelGenerationInputStableSamplers } from "../../internal_libs/aihorde";
import Advanced from "./ai/advanced";


const commandData = new SlashCommandBuilder()
    .setName("ia")
    .setDescription("Commandes IA")
    .addSubcommand(subcommand => subcommand
        .setName("imagine")
        .setDescription("Créer une image par IA")
        .setDescriptionLocalizations({
            fr: "Créer une image par IA",
            "en-GB": "Create an image by AI",
            "en-US": "Create an image by AI"
        })
        .addStringOption(option => option.setName("prompt").setDescription("Une description de l'image à créer").setRequired(true).setDescriptionLocalizations({
            fr: "Une description de l'image à créer",
            "en-GB": "A description of the image to create",
            "en-US": "A description of the image to create"
        }).setNameLocalizations({
            fr: "prompt",
            "en-GB": "prompt",
            "en-US": "prompt"
        }).setMaxLength(1000))
        .addStringOption(option => option.setName("loras").setDescription("Loras à utiliser").setRequired(false).setDescriptionLocalizations({
            fr: "Loras à utiliser",
            "en-GB": "Loras to use",
            "en-US": "Loras to use"
        }).setNameLocalizations({
            fr: "loras"
        }).setAutocomplete(true))
        .addBooleanOption(option => option.setName("nsfw").setDescription("Activer le NSFW").setRequired(false).setDescriptionLocalizations({
            fr: "Activer le NSFW",
            "en-GB": "Enable NSFW",
            "en-US": "Enable NSFW"
        }))
        .addStringOption(option => option.setName("negative_prompt").setDescription("Decrire ce que l'image ne doit pas être").setRequired(false).setNameLocalizations({
            fr: "prompt_negatif"
        }).setDescriptionLocalizations({
            fr: "Decrire ce que l'image ne doit pas être",
            "en-GB": "Describe what the image should not be",
            "en-US": "Describe what the image should not be"
        }))
        .addStringOption(option => option.setName("model").setDescription("Un style à choisir pour l'image").setRequired(false).setDescriptionLocalizations({
            fr: "Un style à choisir pour l'image",
            "en-GB": "A style to choose for the image",
            "en-US": "A style to choose for the image"
        }).setNameLocalizations({
            fr: "modèle"
        }).setAutocomplete(true))
    )
    .addSubcommand(subcommand => subcommand
        .setName("login")
        .setDescription("Ce connecter à stablehorde.net")
        .setDescriptionLocalizations({
            fr: "Ce connecter à stablehorde.net",
            "en-GB": "Login to stablehorde.net",
            "en-US": "Login to stablehorde.net"
        })
    )
    .addSubcommand(subcommand => subcommand
        .setName("help")
        .setDescription("Afficher l'aide IA")
        .setDescriptionLocalizations({
            fr: "Afficher l'aide IA",
            "en-GB": "Show IA help",
            "en-US": "Show IA help"
        })
    )
    .addSubcommand(subcommand => subcommand
        .setName("info")
        .setDescription("Afficher les informations d'un utilisateur")
        .setDescriptionLocalizations({
            fr: "Afficher les informations d'un utilisateur",
            "en-GB": "Show user informations",
            "en-US": "Show user informations"
        })
        .addUserOption(option => option.setName("user").setDescription("L'utilisateur").setRequired(false).setDescriptionLocalizations({
            fr: "L'utilisateur",
            "en-GB": "The user",
            "en-US": "The user"
        }))
    )
    .addSubcommand(subcommand => subcommand
        .setName("logout")
        .setDescription("Se déconnecter de stablehorde.net")
        .setDescriptionLocalizations({
            fr: "Se déconnecter de stablehorde.net",
            "en-GB": "Logout to stablehorde.net",
            "en-US": "Logout to stablehorde.net"
        })
    )
    .addSubcommand(subcommand => subcommand
        .setName("ask")
        .setDescription("Poser une question à l'IA")
        .setDescriptionLocalizations({
            fr: "Poser une question à l'IA",
            "en-GB": "Ask a question to the AI",
            "en-US": "Ask a question to the AI"
        })
        .addStringOption(option => option.setName("question").setDescription("La question à poser").setRequired(true).setDescriptionLocalizations({
            fr: "La question à poser",
            "en-GB": "The question to ask",
            "en-US": "The question to ask"
        }).setMaxLength(1024))
        .addNumberOption(option => option.setName("temperature").setDescription("La température de la réponse").setRequired(false).setDescriptionLocalizations({
            fr: "La température de la réponse",
            "en-GB": "The temperature of the answer",
            "en-US": "The temperature of the answer"
        }))
        .addNumberOption(option => option.setName("top-p").setDescription("La probabilité de la réponse").setRequired(false).setDescriptionLocalizations({
            fr: "La probabilité de la réponse",
            "en-GB": "The probability of the answer",
            "en-US": "The probability of the answer"
        }))
        .addNumberOption(option => option.setName("frequency-penalty").setDescription("La pénalité de fréquence").setRequired(false).setDescriptionLocalizations({
            fr: "La pénalité de fréquence",
            "en-GB": "The frequency penalty",
            "en-US": "The frequency penalty"
        }))
    ).addSubcommand(subcommand => subcommand
        .setName("interogate")
        .setDescription("Interroger l'IA")
        .setDescriptionLocalizations({
            fr: "Interroger l'IA",
            "en-GB": "Interrogate the AI",
            "en-US": "Interrogate the AI"
        })
        .addAttachmentOption(option => option.setName("image").setDescription("L'image à interroger").setRequired(true).setDescriptionLocalizations({
            fr: "L'image à interroger",
            "en-GB": "The image to interrogate",
            "en-US": "The image to interrogate"
        }))
    ).addSubcommandGroup(subcommandGroup => subcommandGroup
        .setName("advanced")
        .setDescription("Commandes avancées de génération").addSubcommand(subcommand => subcommand
            .setName("imagine")
            .setDescription("Créer une image par IA")
            .setDescriptionLocalizations({
                fr: "Créer une image par IA",
                "en-GB": "Create an image by AI",
                "en-US": "Create an image by AI"
            })
            .addStringOption(option => option.setName("prompt").setDescription("Une description de l'image à créer").setRequired(true).setDescriptionLocalizations({
                fr: "Une description de l'image à créer",
                "en-GB": "A description of the image to create",
                "en-US": "A description of the image to create"
            }).setNameLocalizations({
                fr: "prompt",
                "en-GB": "prompt",
                "en-US": "prompt"
            }).setMaxLength(1000))
            .addStringOption(option => option.setName("loras").setDescription("Loras à utiliser").setRequired(false).setDescriptionLocalizations({
                fr: "Loras à utiliser",
                "en-GB": "Loras to use",
                "en-US": "Loras to use"
            }).setNameLocalizations({
                fr: "loras"
            }).setAutocomplete(true))
            .addBooleanOption(option => option.setName("nsfw").setDescription("Activer le NSFW").setRequired(false).setDescriptionLocalizations({
                fr: "Activer le NSFW",
                "en-GB": "Enable NSFW",
                "en-US": "Enable NSFW"
            }))
            .addStringOption(option => option.setName("negative_prompt").setDescription("Decrire ce que l'image ne doit pas être").setRequired(false).setNameLocalizations({
                fr: "prompt_negatif"
            }).setDescriptionLocalizations({
                fr: "Decrire ce que l'image ne doit pas être",
                "en-GB": "Describe what the image should not be",
                "en-US": "Describe what the image should not be"
            }))
            .addStringOption(option => option.setName("model").setDescription("Un style à choisir pour l'image").setRequired(false).setDescriptionLocalizations({
                fr: "Un style à choisir pour l'image",
                "en-GB": "A style to choose for the image",
                "en-US": "A style to choose for the image"
            }).setNameLocalizations({
                fr: "modèle"
            }).setAutocomplete(true))
            .addNumberOption(option => option.setName("step").setDescription("Le nombre d'étapes à effectuer").setRequired(false).setDescriptionLocalizations({
                fr: "Le nombre d'étapes à effectuer",
                "en-GB": "The number of steps to perform",
                "en-US": "The number of steps to perform"
            }).setMinValue(1).setMaxValue(500))
            .addNumberOption(option => option.setName("width").setDescription("La largeur de l'image").setRequired(false).setDescriptionLocalizations({
                fr: "La largeur de l'image",
                "en-GB": "The width of the image",
                "en-US": "The width of the image"
            }).setMinValue(64).setMaxValue(3072))
            .addNumberOption(option => option.setName("height").setDescription("La hauteur de l'image").setRequired(false).setDescriptionLocalizations({
                fr: "La hauteur de l'image",
                "en-GB": "The height of the image",
                "en-US": "The height of the image"
            }).setMinValue(64).setMaxValue(3072))
            .addStringOption(option => option.setName("sampler_name").setDescription("Le nom de l'échantillonneur").setRequired(false).setDescriptionLocalizations({
                fr: "Le nom de l'échantillonneur",
                "en-GB": "The name of the sampler",
                "en-US": "The name of the sampler"
            }).addChoices({
                name: ModelGenerationInputStableSamplers.DDIM,
                value: ModelGenerationInputStableSamplers.DDIM
            }, {
                name: ModelGenerationInputStableSamplers.dpmsolver,
                value: ModelGenerationInputStableSamplers.dpmsolver
            },{
                name: ModelGenerationInputStableSamplers.PLMS,
                value: ModelGenerationInputStableSamplers.PLMS
            },{
                name: ModelGenerationInputStableSamplers.k_dpm_2,
                value: ModelGenerationInputStableSamplers.k_dpm_2
            },{
                name: ModelGenerationInputStableSamplers.k_dpm_2_a,
                value: ModelGenerationInputStableSamplers.k_dpm_2_a
            },{
                name: ModelGenerationInputStableSamplers.k_dpm_adaptive,
                value: ModelGenerationInputStableSamplers.k_dpm_adaptive
            },{
                name: ModelGenerationInputStableSamplers.k_dpm_fast,
                value: ModelGenerationInputStableSamplers.k_dpm_fast
            },{
                name: ModelGenerationInputStableSamplers.k_dpmpp_2m,
                value: ModelGenerationInputStableSamplers.k_dpmpp_2m
            },{
                name: ModelGenerationInputStableSamplers.k_dpmpp_2s_a,
                value: ModelGenerationInputStableSamplers.k_dpmpp_2s_a
            },{
                name: ModelGenerationInputStableSamplers.k_euler,
                value: ModelGenerationInputStableSamplers.k_euler
            },{
                name: ModelGenerationInputStableSamplers.k_heun,
                value: ModelGenerationInputStableSamplers.k_heun
            },{
                name: ModelGenerationInputStableSamplers.k_lms,
                value: ModelGenerationInputStableSamplers.k_lms
            })).addNumberOption(option => option.setName("clip_skip").setDescription("Le nombre de pas à ignorer").setRequired(false).setDescriptionLocalizations({
                fr: "Le nombre de pas à ignorer",
                "en-GB": "The number of steps to skip",
                "en-US": "The number of steps to skip"
            }).setMaxValue(12).setMinValue(1))
            .addNumberOption(option => option.setName("n").setDescription("Le nombre d'image à générer").setRequired(false).setDescriptionLocalizations({
                fr: "Le nombre d'image à générer",
                "en-GB": "The number of images to generate",
                "en-US": "The number of images to generate"
            }).setMaxValue(10).setMinValue(1))
        )
    )
    .toJSON();

export class IaCommand extends CommandsBase {
    constructor(client: Bot) {
        super(client, commandData);
    }

    async run(interaction: CommandInteraction){
        let options = interaction.options
        if (options instanceof CommandInteractionOptionResolver) {
            let subcommand = options.getSubcommandGroup() ?? options.getSubcommand();
            switch (subcommand) {
                case "advanced":
                    await Advanced(this, interaction);
                    break;
                case "imagine":
                    await Imagine(this, interaction);
                    break;
                case "login":
                    await Login(this, interaction);
                    break;
                case "help":
                    await Help(this, interaction);
                    break;
                case "info":
                    await Info(this, interaction);
                    break;
                case "logout":
                    await Logout(this, interaction);
                    break;
                case "ask":
                    await Ask(this, interaction);
                    break;
                case "interogate":
                    await Interogate(this, interaction);
                    break;
                default:
                    interaction.reply({
                        content: "Une erreur est survenue",
                        flags: MessageFlags.Ephemeral
                    });
                    break;
            }
        } else {
            interaction.reply({
                content: "Une erreur est survenue",
                flags: MessageFlags.Ephemeral
            });
        }
    }

    async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        let options = interaction.options;
        if (options instanceof CommandInteractionOptionResolver) {
            let autocomplete = options.getFocused(true);
            if (autocomplete.name === "model") {
                this.client.aiHorde.getModels().then((models) => {

                    let modelsFiltereds = models;
                    if (autocomplete.value.length > 0) {
                        modelsFiltereds = models.filter((modelFilter) => {
                            if (!modelFilter?.name) return false;
                            return modelFilter?.name.toLowerCase().includes(autocomplete.value.toLowerCase());
                        });
                    }
                    modelsFiltereds = modelsFiltereds.slice(0, 24);
                    let optionsMapped: ApplicationCommandOptionChoiceData[] = modelsFiltereds.map((model) => {
                        return {
                            name: `${model.name} (Queue ${model.queued} - ${model.count} workers)`,
                            value: model.name as string
                        }
                    })
                    interaction.respond(optionsMapped);
                });
            }else if(autocomplete.name === "loras"){
                this.client.aiHorde.getLorasModels(autocomplete.name).then((models) => {
                    interaction.respond(models.items.map((model) => {
                        return {
                            name: `${model.name.substring(0,60)} ${model.nsfw ? "(NSFW)" : ""}`,
                            value: model.name
                        }
                    })).catch((_) => {
                        // ignore Too Much Time passed
                    });
                });
            }
        }
    }
}