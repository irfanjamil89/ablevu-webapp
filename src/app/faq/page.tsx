'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Footer from '../component/Footer';
import Header2 from '../component/Header2';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    items: FAQItem[];
}

const faqData: FAQSection[] = [
    {
        title: "For Travelers and AbleVu Users",
        items: [
            {
                question: "What is AbleVu?",
                answer: "AbleVu is a discovery and information platform that shares practical, real-world details about places so people can better understand what to expect before visiting."
            },
            {
                question: "How is AbleVu different from review sites?",
                answer: "AbleVu focuses on observable, factual details rather than opinions or ratings. Information is collected and presented to help visitors plan, not to judge or rank businesses."
            },
            {
                question: "What kind of information does AbleVu provide?",
                answer: "AbleVu shares clear, usable details such as layout features, entrances, restrooms, seating, and other practical considerations that may matter when planning a visit."
            },
            {
                question: "Does AbleVu guarantee accommodations will work for me?",
                answer: "No. AbleVu does not guarantee outcomes or experiences. Information is provided to support informed decision-making, not to replace personal judgment or direct communication when needed."
            },
            {
                question: "What does \"transparent information\" mean?",
                answer: "It means sharing what is visible and observable in the real world, without assumptions, opinions, or endorsements."
            },
            {
                question: "Why do some places show limited details?",
                answer: "Some businesses choose not to unlock their profiles. When this happens, only basic information is shown so users know the place exists, even if full details are not yet available."
            },
            {
                question: "Can I rely on AbleVu instead of calling ahead?",
                answer: "AbleVu is designed to reduce uncertainty, but it does not replace personal preference or direct confirmation for specific needs."
            },
            {
                question: "Is AbleVu only for people with disabilities?",
                answer: "No. AbleVu is for anyone who benefits from knowing what to expect before arriving, including caregivers, families, aging travelers, and people planning ahead."
            }
        ]
    },
    {
        title: "Locked Profiles and Visibility",
        items: [
            {
                question: "Why do some businesses appear with limited information?",
                answer: "Businesses control whether their full details are visible. If a profile is locked, it means the business has not yet chosen to unlock or complete its information."
            },
            {
                question: "What can I see when a profile is locked?",
                answer: "Users can see the business name, category, and city. Detailed information is not shown until the profile is unlocked."
            },
            {
                question: "Does a locked profile mean the business is not welcoming?",
                answer: "No. A locked profile simply means detailed information is not currently available."
            },
            {
                question: "How do businesses unlock their profiles?",
                answer: "Businesses can unlock their profiles directly through AbleVu to share full details and manage their information."
            },
            {
                question: "Does payment affect accuracy?",
                answer: "No. Information shown on AbleVu is based on observable facts and business-provided updates, not payment status."
            }
        ]
    },
    {
        title: "For Businesses and Venues",
        items: [
            {
                question: "Why is my business listed on AbleVu?",
                answer: "AbleVu may list businesses to help visitors discover places and plan ahead."
            },
            {
                question: "Do I have to pay to be listed?",
                answer: "No. Basic listings may appear without payment. Full profile details require unlocking."
            },
            {
                question: "What does unlocking my profile allow?",
                answer: "Unlocking allows your business to share full information, be searchable in AbleBot, and manage your profile directly."
            },
            {
                question: "Can I update my information myself?",
                answer: "Yes. Businesses control their profiles and can update information in real time."
            },
            {
                question: "Who owns the information on my profile?",
                answer: "Profile information is shared ownership between the business and AbleVu."
            },
            {
                question: "Can I remove my business from AbleVu?",
                answer: "Yes. Businesses can request removal or opt out."
            },
            {
                question: "Does AbleVu rate or endorse businesses?",
                answer: "No. AbleVu does not rate, endorse, or approve businesses."
            },
            {
                question: "What is the AbleVu badge?",
                answer: "The AbleVu badge indicates participation and transparency. It is not a certification, guarantee, or endorsement."
            },
            {
                question: "Can I use the badge in my marketing?",
                answer: "Yes. Businesses may use the badge freely, following AbleVu usage guidelines."
            }
        ]
    },
    {
        title: "For Cities and Destinations",
        items: [
            {
                question: "How does AbleVu work for cities and destinations?",
                answer: "AbleVu helps cities share practical, usable information about public spaces so visitors can plan with confidence."
            },
            {
                question: "Can cities control their information?",
                answer: "Yes. Cities and destinations can manage, update, or remove their data."
            },
            {
                question: "Who owns city level information?",
                answer: "Information is shared ownership between the city or destination and AbleVu."
            },
            {
                question: "Does AbleVu replace audits or inspections?",
                answer: "No. AbleVu is an information and discovery platform, not a compliance or inspection service."
            }
        ]
    },
    {
        title: "Contributor Program",
        items: [
            {
                question: "Who are AbleVu contributors?",
                answer: "Contributors are trained individuals who document observable facts about places using a structured data collection process."
            },
            {
                question: "Are contributors employees or inspectors?",
                answer: "No. Contributors are neither employees nor inspectors."
            },
            {
                question: "What do contributors collect?",
                answer: "Contributors document visible, observable features using predefined data points."
            },
            {
                question: "What do contributors not do?",
                answer: "Contributors do not give opinions, make judgments, sell services, negotiate, or influence placement."
            },
            {
                question: "What if a contributor is unsure?",
                answer: "If a contributor is unsure, they pause and contact AbleVu support. Submissions may be delayed and reviewed case by case."
            },
            {
                question: "Are contributors involved in sales?",
                answer: "No. AbleVu handles all sales and business relationships."
            },
            {
                question: "How are contributors paid?",
                answer: "Contributors are paid after a business unlocks its profile."
            },
            {
                question: "Can a business opt out of contributor visits?",
                answer: "Yes."
            },
            {
                question: "Can businesses change contributor submitted information?",
                answer: "Yes. Businesses control their profiles and can update information at any time."
            }
        ]
    },
    {
        title: "AbleBot™",
        items: [
            {
                question: "What is AbleBot?",
                answer: "AbleBot is a search and discovery tool that helps users find places using AbleVu data."
            },
            {
                question: "Does AbleBot rank businesses?",
                answer: "No. AbleBot filters information based on user searches. It does not rank or recommend."
            },
            {
                question: "Is AbleBot giving advice?",
                answer: "No. AbleBot provides information only."
            },
            {
                question: "Where does AbleBot's information come from?",
                answer: "AbleBot uses data from business profiles and contributor submissions."
            }
        ]
    },
    {
        title: "Accuracy, Updates, and Corrections",
        items: [
            {
                question: "What if information is outdated or incorrect?",
                answer: "AbleVu encourages businesses and users to report updates so information can stay current."
            },
            {
                question: "How are corrections handled?",
                answer: "AbleVu reviews concerns, works with businesses, and may temporarily remove disputed information if needed."
            },
            {
                question: "Can businesses update information themselves?",
                answer: "Yes. Businesses can update their profiles directly at any time."
            }
        ]
    },
    {
        title: "Investors and Company Information",
        items: [
            {
                question: "Is AbleVu a for profit company?",
                answer: "Yes."
            },
            {
                question: "How does AbleVu generate revenue?",
                answer: "AbleVu generates revenue from participating businesses and cities that unlock profiles or engage with platform tools."
            },
            {
                question: "Where can investors learn more?",
                answer: "Interested parties can contact AbleVu directly at support@ablevu.com or visit the investor page."
            }
        ]
    },
    {
        title: "Legal and Disclaimers",
        items: [
            {
                question: "Is AbleVu a certification or compliance service?",
                answer: "No."
            },
            {
                question: "Does AbleVu guarantee experiences or outcomes?",
                answer: "No."
            },
            {
                question: "Is AbleVu providing legal, medical, or professional advice?",
                answer: "No."
            },
            {
                question: "Where can I read the full disclaimer?",
                answer: "The full disclaimer is available on the AbleVu website."
            }
        ]
    }
];

const FAQAccordionItem: React.FC<{
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={onToggle}
                className="w-full flex items-start justify-between py-5 px-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-gray-900 pr-8">{item.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (sectionIndex: number, itemIndex: number) => {
        const key = `${sectionIndex}-${itemIndex}`;
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    return (
        <div className=''>
            <Header2 />
            <div className=" px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-semibold">Frequently Asked Questions</h1>
                    <p className="text-sm mt-5">
                        Everything you need to know about AbleVu
                    </p>
                </div>
                

                <div className="space-y-8">
                    {faqData.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">
                                    {section.title}
                                </h2>
                            </div>
                            <div>
                                {section.items.map((item, itemIndex) => (
                                    <FAQAccordionItem
                                        key={itemIndex}
                                        item={item}
                                        isOpen={openItems.has(`${sectionIndex}-${itemIndex}`)}
                                        onToggle={() => toggleItem(sectionIndex, itemIndex)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="mailto:support@ablevu.com"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Page;