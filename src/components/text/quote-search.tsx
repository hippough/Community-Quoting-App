"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@prisma/client";
import { Copy, Rabbit, Search, Settings2, Squirrel } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
import { Cursor } from "../ui/cursor";
import { Badge } from "../ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type RelatedResult = {
	term: string;
	quote: string;
};

export default function QuoteSearch({ text }: { text: Text }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSearchTerm, setActiveSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [relatedResults, setRelatedResults] = useState<RelatedResult[]>([]);
	const [contextSize, setContextSize] = useState(3);
	const [relatedSearchTerms, setRelatedSearchTerms] = useState(false);
	const [unlimited, setUnlimited] = useState(false);
	const [maxResults, setMaxResults] = useState(25);
	const [strictSearch, setStrictSearch] = useState(false);

	// for the click
	const [isClickSearch, setIsClickSearch] = useState(false);

	useEffect(() => {
		if (isClickSearch) {
			handleSearch();
			setIsClickSearch(false);
		}
	}, [isClickSearch]);

	const splitIntoSentences = (text: string): string[] => {
		return text.match(/[^.!?]+[.!?]+[\])'"`'"]*|.+/g) || [];
	};

	const findKeywordMatches = (sentences: string[], keyword: string) => {
		const searchTerm = keyword.toLowerCase();
		const matchedIndices: number[] = [];

		sentences.forEach((sentence, index) => {
			if (strictSearch) {
				// Strict search: match only whole words
				const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
				// Convert words array to string[] type to satisfy TypeScript
				const wordStrings: string[] = words.map((word) => word.toString());
				if (wordStrings.includes(searchTerm)) {
					matchedIndices.push(index);
				}
			} else {
				// Regular search: match substrings
				if (sentence.toLowerCase().includes(searchTerm)) {
					matchedIndices.push(index);
				}
			}
		});

		return unlimited ? matchedIndices : matchedIndices.slice(0, maxResults);
	};

	const getContextSentences = (
		sentences: string[],
		matchedIndices: number[],
		contextSize = 3
	) => {
		const results: string[] = [];

		matchedIndices.forEach((matchIndex) => {
			const start = Math.max(0, matchIndex - contextSize);
			const end = Math.min(sentences.length, matchIndex + contextSize + 1);
			const context = sentences.slice(start, end).join(" ");
			results.push(context);
		});

		return results;
	};

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setActiveSearchTerm(searchQuery);
		const sentences = splitIntoSentences(text.content);
		const matchedIndices = findKeywordMatches(sentences, searchQuery);
		const results = getContextSentences(sentences, matchedIndices, contextSize);
		setSearchResults(results);

		if (relatedSearchTerms) {
			const synonyms = await getRelatedSearchTerms();
			const relatedResults = getRelatedSearchResults(sentences, synonyms);
			setRelatedResults(relatedResults);
		}
	};

	const getRelatedSearchTerms = async () => {
		try {
			const response = await fetch(
				`https://words.bighugelabs.com/api/2/000be8c22b800dc0c80121dd328cebb2/${searchQuery}/json`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch related terms");
			}

			const data = await response.json();

			// The API returns data organized by part of speech (noun, verb, etc.)
			const synonyms = new Set<string>();

			// Loop through all parts of speech
			// eslint-disable-next-line  @typescript-eslint/no-explicit-any
			Object.values(data).forEach((partOfSpeech: any) => {
				// Add synonyms if they exist
				if (partOfSpeech.syn) {
					partOfSpeech.syn.forEach((synonym: string) => synonyms.add(synonym));
				}
			});

			// Convert Set to Array
			const uniqueSynonyms = Array.from(synonyms);

			return uniqueSynonyms;
		} catch (error) {
			console.error("Error fetching related terms:", error);
			toast.error("Failed to fetch related terms");
		}
	};

	const getRelatedSearchResults = (
		sentences: string[],
		synonyms: string[] | undefined
	) => {
		if (!synonyms) return [];
		if (synonyms.length === 0) return [];

		const results: RelatedResult[] = [];

		sentences.forEach((sentence, index) => {
			const sentenceLower = sentence.toLowerCase();
			synonyms.forEach((synonym) => {
				// If we haven't found a quote for this term yet
				// Handle strict search by properly typing the word array
				let foundMatch: boolean;
				if (strictSearch) {
					const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
					const wordStrings: string[] = words.map((word) => word.toString());
					foundMatch = wordStrings.includes(synonym.toLowerCase());
				} else {
					foundMatch = sentenceLower.includes(synonym.toLowerCase());
				}

				if (!results.some((r) => r.term === synonym) && foundMatch) {
					// Get context for this match
					const start = Math.max(0, index - contextSize);
					const end = Math.min(sentences.length, index + contextSize + 1);
					const quote = sentences.slice(start, end).join(" ");

					results.push({ term: synonym, quote });
				}

				if (results.length === synonyms.length) {
					return;
				}
			});
		});

		return results;
	};

	const highlightSearchTerm = (text: string, searchTerm: string) => {
		if (!searchTerm) return text;

		const regex = new RegExp(`(${searchTerm})`, "gi");
		const parts = text.split(regex);

		return parts.map((part, index) =>
			part.toLowerCase() === searchTerm.toLowerCase() ? (
				<strong key={index} className="font-bold">
					{part}
				</strong>
			) : (
				part
			)
		);
	};

	const handleCopyQuote = async (quote: string) => {
		try {
			await navigator.clipboard.writeText(quote);
			toast.success("Quote copied to clipboard");
		} catch (error) {
			toast.error("Failed to copy quote");
			console.error("Error copying:", error);
		}
	};

	return (
		<Card className="mt-16">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Quote Search</CardTitle>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Settings2 className="h-5 w-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72">
						<DropdownMenuLabel>Search Settings</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<div className="p-4 space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label>Context Size: {contextSize} sentences</Label>
								</div>
								<Slider
									value={[contextSize]}
									onValueChange={(value) => setContextSize(value[0])}
									min={1}
									max={8}
									step={1}
									className="w-full"
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label>Unlimited Results</Label>
								<Switch checked={unlimited} onCheckedChange={setUnlimited} />
							</div>

							{!unlimited && (
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label>Max Results: {maxResults}</Label>
									</div>
									<Slider
										value={[maxResults]}
										onValueChange={(value) => setMaxResults(value[0])}
										min={5}
										max={50}
										step={5}
										disabled={unlimited}
										className="w-full"
									/>
								</div>
							)}
							<div className="flex items-center justify-between space-x-2">
								<Label>Related Search Terms</Label>
								<Switch
									checked={relatedSearchTerms}
									onCheckedChange={setRelatedSearchTerms}
								/>
							</div>

							<div className="flex items-center justify-between space-x-2">
								<Label>Strict Word Search</Label>
								<Switch
									checked={strictSearch}
									onCheckedChange={setStrictSearch}
								/>
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex space-x-4">
					<Input
						placeholder="Enter search term..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={async (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleSearch();
							}
						}}
					/>
					<Button onClick={handleSearch}>Search</Button>
				</div>

				<Tabs defaultValue="results">
					<TabsList className="w-full">
						<TabsTrigger value="results" className="w-full">
							Results {`(${searchResults.length})`}
						</TabsTrigger>

						{relatedSearchTerms && (
							<TabsTrigger value="related" className="w-full">
								Related {`(${relatedResults.length})`}
							</TabsTrigger>
						)}
					</TabsList>
					<TabsContent value="results">
						{searchResults.length > 0 ? (
							<ScrollArea
								className="h-[calc(100vh-325px)] w-full"
								type="always"
							>
								<div className="space-y-4">
									{searchResults.map((result, index) => (
										<div
											key={index}
											className="text-sm group p-4 rounded-md border hover:bg-accent"
											onClick={() => handleCopyQuote(result)}
										>
											<div>
												<Cursor
													attachToParent
													className="overflow-hidden"
													springConfig={{
														bounce: 0.01,
													}}
												>
													<Badge>
														<Copy className="w-4 h-4" />
													</Badge>
												</Cursor>
												{highlightSearchTerm(result, activeSearchTerm)}
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						) : (
							<Card className="mt-4">
								<CardHeader>
									<CardTitle className="flex items-center">
										No Results
										<Rabbit className="h-6 w-6 ml-2" />
									</CardTitle>
									<CardDescription>
										Try searching for another word.
									</CardDescription>
								</CardHeader>
							</Card>
						)}
					</TabsContent>
					<TabsContent value="related">
						{relatedResults.length > 0 ? (
							<ScrollArea
								className="h-[calc(100vh-325px)] w-full"
								type="always"
							>
								<div className="space-y-4">
									{relatedResults.map((result, index) => (
										<div
											key={index}
											className="text-sm group p-4 rounded-md border hover:bg-accent"
											onClick={() => {
												setSearchQuery(result.term);
												setIsClickSearch(true);
											}}
										>
											<div>
												<Cursor
													attachToParent
													className="overflow-hidden"
													springConfig={{
														bounce: 0.01,
													}}
												>
													<Badge>
														<Search className="w-4 h-4 mr-2" />
														Search
													</Badge>
												</Cursor>
												{highlightSearchTerm(result.quote, result.term)}
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						) : (
							<Card className="mt-4">
								<CardHeader>
									<CardTitle className="flex items-center">
										No Results
										<Squirrel className="h-6 w-6 ml-2" />
									</CardTitle>
									<CardDescription>
										Try searching for another word.
									</CardDescription>
								</CardHeader>
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
